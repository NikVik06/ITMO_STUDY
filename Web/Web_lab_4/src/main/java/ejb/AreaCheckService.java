package ejb;

import entity.PointResult;
import entity.User;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Stateless
@Transactional
public class AreaCheckService {

    @PersistenceContext(unitName = "areaPU")
    private EntityManager em;

    public Map<String, Object> checkPoint(Double x, Double y, Double r, User user) {
        long startTime = System.nanoTime();
        boolean hit = checkHit(x, y, r);
        long executionTime = System.nanoTime() - startTime;

        PointResult result = new PointResult(x, y, r, hit, executionTime, user);
        em.persist(result);

        Map<String, Object> response = new HashMap<>();
        response.put("x", x);
        response.put("y", y);
        response.put("r", r);
        response.put("hit", hit);
        response.put("executionTime", executionTime);
        response.put("createdAt", LocalDateTime.now().toString());

        return response;
    }

    private boolean checkHit(Double x, Double y, Double r) {
        if (x >= 0 && y >= 0 && (x*x + y*y) <= (r/2)*(r/2)) {
            return true;
        }
        if (x <= 0 && y >= 0 && y <= (x + r)) {
            return true;
        }
        return x <= 0 && y <= 0 && x >= -r/2 && y >= -r;
    }

    public List<PointResult> getUserResults(User user) {
        TypedQuery<PointResult> query = em.createQuery(
                "SELECT p FROM PointResult p WHERE p.user = :user ORDER BY p.createdAt DESC",
                PointResult.class
        );
        query.setParameter("user", user);
        return query.getResultList();
    }

    public void clearUserResults(User user) {
        em.createQuery("DELETE FROM PointResult p WHERE p.user = :user")
                .setParameter("user", user)
                .executeUpdate();
    }
}