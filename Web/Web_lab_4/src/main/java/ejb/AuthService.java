package ejb;

import entity.User;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.UUID;

@Stateless
@Transactional
public class AuthService {

    @PersistenceContext(unitName = "areaPU")
    private EntityManager em;

    public String authenticate(String username, String password) {
        try {
            User user = em.createQuery(
                            "SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getSingleResult();

            if (BCrypt.checkpw(password, user.getPasswordHash())) {
                String token = UUID.randomUUID().toString();

                user.setToken(token);
                em.merge(user);
                em.flush();

                System.out.println("Auth: Token saved to PostgreSQL: " + token);
                return token;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public User validateToken(String token) {
        System.out.println("Validating token: " + token);

        if (token == null || token.trim().isEmpty()) {
            System.out.println("Token is null or empty");
            return null;
        }

        try {
            User user = em.createQuery(
                            "SELECT u FROM User u WHERE u.token = :token", User.class)
                    .setParameter("token", token)
                    .getSingleResult();

            System.out.println("Token valid for user: " + user.getUsername());
            return user;

        } catch (NoResultException e) {
            System.out.println("Token invalid or not found in DB");
            return null;
        } catch (Exception e) {
            System.out.println("Error validating token: " + e.getMessage());
            return null;
        }
    }

    public void logout(String token) {
        if (token != null && !token.trim().isEmpty()) {
            try {
                User user = em.createQuery(
                                "SELECT u FROM User u WHERE u.token = :token", User.class)
                        .setParameter("token", token)
                        .getSingleResult();

                user.setToken(null);
                em.merge(user);
                System.out.println("User logged out: " + user.getUsername());

            } catch (NoResultException e) {
                System.out.println("Token not found during logout");
            } catch (Exception e) {
                System.out.println("Error during logout: " + e.getMessage());
            }
        }
    }


    @PostConstruct
    public void init() {
        clearAllTokens();
        createTestUser();
    }


    private void clearAllTokens() {
        try {
            System.out.println("=== CLEARING ALL TOKENS ON STARTUP ===");

            List<User> usersWithTokens = em.createQuery(
                            "SELECT u FROM User u WHERE u.token IS NOT NULL", User.class)
                    .getResultList();

            System.out.println("Found " + usersWithTokens.size() + " users with tokens");

            for (User user : usersWithTokens) {
                System.out.println("Clearing token for user: " + user.getUsername());
                user.setToken(null);
                em.merge(user);
            }

            em.flush();
            System.out.println("=== ALL TOKENS CLEARED ===");

        } catch (Exception e) {
            System.err.println("Error clearing tokens: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createTestUser() {
        try {
            System.out.println("=== Creating test user ===");

            Long count = em.createQuery(
                            "SELECT COUNT(u) FROM User u WHERE u.username = 'admin'",
                            Long.class)
                    .getSingleResult();

            System.out.println("Existing admin users: " + count);

            if (count == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPasswordHash(BCrypt.hashpw("admin123", BCrypt.gensalt()));
                em.persist(admin);
                System.out.println("Created test user: admin/admin123");
            } else {
                System.out.println("Test user already exists");
            }

        } catch (Exception e) {
            System.err.println("Could not create test user: " + e.getMessage());
            e.printStackTrace();
        }
    }

}