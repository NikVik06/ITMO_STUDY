package dao;

import model.PointResult;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DatabaseManager {

    private static final Logger logger = Logger.getLogger(DatabaseManager.class.getName());

    private static final String URL = "jdbc:postgresql://localhost:5432/postgres";
    private static final String USERNAME = "postgres";
    private static final String PASSWORD = "BamBinBamiyfrng135823.";

    private static final String INSERT_SQL =
            "INSERT INTO point_results (x_coordinate, y_coordinate, radius, hit_result, execution_time) " +
                    "VALUES (?, ?, ?, ?, ?)";

    private static final String SELECT_ALL_SQL =
            "SELECT id, x_coordinate, y_coordinate, radius, hit_result, check_time, execution_time " +
                    "FROM point_results ORDER BY check_time DESC";

    private static final String CLEAR_ALL_SQL =
            "DELETE FROM point_results";

    static {
        initializeDriver();
    }

    private static void initializeDriver() {
        try {

            Class.forName("org.postgresql.Driver");
            logger.info("PostgreSQL JDBC Driver loaded successfully");

            try (Connection conn = getConnection()) {
                logger.info("Successfully connected to PostgreSQL database via JDBC");
                checkTableStructure(conn);
            }

        } catch (ClassNotFoundException e) {
            logger.log(Level.SEVERE, "PostgreSQL JDBC Driver not found", e);
            throw new RuntimeException("PostgreSQL JDBC Driver not found", e);
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Failed to connect to PostgreSQL database", e);
            throw new RuntimeException("Failed to connect to PostgreSQL database", e);
        }
    }

    private static void checkTableStructure(Connection conn) throws SQLException {
        try {
            String testQuery = "SELECT 1 FROM point_results LIMIT 1";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(testQuery)) {
                logger.info("Table 'point_results' exists and is accessible");
            }
        } catch (SQLException e) {
            if (e.getSQLState().equals("42P01")) { //стандартный код состояния SQL (SQLSTATE) в PostgreSQL, который означает "неопределенная таблица" (undefined_table)
                logger.warning("Table 'point_results' does not exist. Creating...");
                createTable(conn);
            } else {
                throw e;
            }
        }
    }

    private static void createTable(Connection conn) throws SQLException {
        String createTableSQL =
                "CREATE TABLE point_results (" +
                        "    id SERIAL PRIMARY KEY," +
                        "    x_coordinate DOUBLE PRECISION NOT NULL," +
                        "    y_coordinate DOUBLE PRECISION NOT NULL," +
                        "    radius DOUBLE PRECISION NOT NULL," +
                        "    hit_result BOOLEAN NOT NULL," +
                        "    check_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "    execution_time BIGINT NOT NULL" +
                        ")";

        try (Statement createStmt = conn.createStatement()) {
            createStmt.execute(createTableSQL);
            logger.info("Table 'point_results' created successfully");
        }
    }

    public static void saveResult(PointResult result) {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setDouble(1, result.getX());
            stmt.setDouble(2, result.getY());
            stmt.setDouble(3, result.getR());
            stmt.setBoolean(4, result.getHit());
            stmt.setLong(5, result.getExecutionTime());

            int rowsAffected = stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    logger.log(Level.INFO, "Result saved to PostgreSQL via JDBC, ID: {0}, rows affected: {1}",
                            new Object[]{generatedKeys.getLong(1), rowsAffected});
                }
            }

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error saving result to PostgreSQL via JDBC", e);
            throw new RuntimeException("PostgreSQL JDBC error while saving result", e);
        }
    }

    public static List<PointResult> getAllResults() {
        List<PointResult> results = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_ALL_SQL);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                PointResult result = extractPointResultFromResultSet(rs);
                results.add(result);
            }

            logger.log(Level.INFO, "Retrieved {0} results from PostgreSQL via JDBC", results.size());

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error retrieving results from PostgreSQL via JDBC", e);
            throw new RuntimeException("PostgreSQL JDBC error while retrieving results", e);
        }

        return results;
    }

    public static void clearResults() {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(CLEAR_ALL_SQL)) {

            int rowsAffected = stmt.executeUpdate();
            logger.log(Level.INFO, "PostgreSQL database cleared via JDBC, rows affected: {0}", rowsAffected);

        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error clearing PostgreSQL database via JDBC", e);
            throw new RuntimeException("PostgreSQL JDBC error while clearing results", e);
        }
    }

    private static PointResult extractPointResultFromResultSet(ResultSet rs) throws SQLException {
        Double x = rs.getDouble("x_coordinate");
        Double y = rs.getDouble("y_coordinate");
        Double r = rs.getDouble("radius");
        Boolean hit = rs.getBoolean("hit_result");
        Timestamp timestamp = rs.getTimestamp("check_time");
        Long executionTime = rs.getLong("execution_time");

        PointResult result = new PointResult(x, y, r, hit, executionTime);
        return result;
    }

    private static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}