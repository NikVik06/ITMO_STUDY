package rest;

import dto.LoginRequest;
import dto.PointRequest;
import ejb.AreaCheckService;
import ejb.AuthService;
import entity.PointResult;
import entity.User;
import jakarta.ejb.EJB;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

import java.util.*;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AreaResource {

    @PersistenceContext(unitName = "areaPU")
    private EntityManager em;

    @EJB
    private AreaCheckService areaCheckService;

    @EJB
    private AuthService authService;


    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response login(LoginRequest loginRequest) {
        System.out.println("=== LOGIN ===");
        System.out.println("Username: " + loginRequest.getUsername());

        try {
            String token = authService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (token != null) {
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("username", loginRequest.getUsername());
                response.put("message", "Login successful");
                System.out.println("Login successful, token: " + token);
                return Response.ok(response).build();
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid username or password");
                System.out.println("Login failed: invalid credentials");
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity(error)
                        .build();
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return Response.status(500)
                    .entity("{\"error\":\"Login failed: " + e.getMessage() + "\"}")
                    .build();
        }
    }



    @POST
    @Path("/check")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response checkPoint(
            @HeaderParam("Authorization") String token,
            PointRequest pointRequest) {

        System.out.println("=== CHECK POINT ===");
        System.out.println("Token: " + token);
        System.out.println("X: " + pointRequest.getX() + ", Y: " + pointRequest.getY() + ", R: " + pointRequest.getR());

        try {
            User user = authService.validateToken(token);
            if (user == null) {
                System.out.println("ERROR: Invalid token");
                return Response.status(401)
                        .entity("{\"error\":\"Invalid or missing token\"}")
                        .build();
            }

            System.out.println("User authenticated: " + user.getUsername());

            Double x = pointRequest.getX();
            Double y = pointRequest.getY();
            Double r = pointRequest.getR();

            if (x == null || y == null || r == null) {
                System.out.println("ERROR: Missing required parameters");
                return Response.status(400)
                        .entity("{\"error\":\"Missing parameters x, y or r\"}")
                        .build();
            }

            if (x < -5 || x > 5 || y < -5 || y > 5) {
                System.out.println("ERROR: Parameters out of range");
                return Response.status(400)
                        .entity("{\"error\":\"Parameters out of valid range\"}")
                        .build();
            }

            if (!isValidR(r)) {
                return Response.status(400)
                        .entity("{\"error\":\"R должен быть положительным числом от 1 до 3\"}")
                        .build();
            }

            System.out.println("Calling AreaCheckService...");
            Map<String, Object> result = areaCheckService.checkPoint(x, y, r, user);
            return Response.ok(result).build();

        } catch (Exception e) {
            System.err.println("CHECK POINT ERROR");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Check failed: " + e.getMessage());
            return Response.status(500).entity(error).build();
        }
    }

    private boolean isValidR(Double r) {
        return (r != null && (r == 1.0 || r == 2.0 || r == 3.0));
    }

    @GET
    @Path("/results")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getResults(@HeaderParam("Authorization") String token) {
        System.out.println("=== GET RESULTS ===");

        User user = authService.validateToken(token);
        if (user == null) {
            System.out.println("Invalid token");
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        System.out.println("Getting results for user: " + user.getUsername());

        List<PointResult> results = areaCheckService.getUserResults(user);
        System.out.println("Found " + results.size() + " results");

        List<Map<String, Object>> responseList = new ArrayList<>();

        for (PointResult result : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", result.getId());
            map.put("x", result.getX());
            map.put("y", result.getY());
            map.put("r", result.getR());
            map.put("hit", result.getHit());
            map.put("executionTime", result.getExecutionTime());
            map.put("createdAt", result.getCreatedAt());
            responseList.add(map);
        }

        return Response.ok(responseList).build();
    }

    @DELETE
    @Path("/results")
    public Response clearResults(@HeaderParam("Authorization") String token) {
        User user = authService.validateToken(token);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }

        areaCheckService.clearUserResults(user);
        return Response.ok().build();
    }

    @POST
    @Path("/logout")
    @Consumes(MediaType.WILDCARD)
    public Response logout(@HeaderParam("Authorization") String token) {
        authService.logout(token);
        return Response.ok().build();
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Response register(LoginRequest loginRequest) {
        System.out.println("=== REGISTER ===");
        System.out.println("Username: " + loginRequest.getUsername());

        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();

            if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
                return Response.status(400)
                        .entity("{\"error\":\"Missing username or password\"}")
                        .build();
            }

            Long count = em.createQuery(
                            "SELECT COUNT(u) FROM User u WHERE u.username = :username",
                            Long.class)
                    .setParameter("username", username)
                    .getSingleResult();

            System.out.println("User count: " + count);

            if (count > 0) {
                return Response.status(409)
                        .entity("{\"error\":\"User already exists\"}")
                        .build();
            }

            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
            em.persist(newUser);
            em.flush();

            System.out.println("User created in database");

            String token = authService.authenticate(username, password);
            System.out.println("Token generated: " + (token != null ? "YES" : token));

            if (token == null) {
                return Response.status(500)
                        .entity("{\"error\":\"Failed to generate token\"}")
                        .build();
            }

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("message", "User created successfully");

            System.out.println("=== REGISTRATION SUCCESS ===");
            return Response.ok(response).build();

        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return Response.status(500)
                    .entity("{\"error\":\"Registration failed: " + e.getMessage() + "\"}")
                    .build();
        }
    }

}