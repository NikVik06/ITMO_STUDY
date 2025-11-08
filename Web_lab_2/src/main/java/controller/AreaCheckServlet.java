package controller;

import model.Result;
//javax
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@WebServlet(name = "AreaCheckServlet", value = "/area-check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            double x = Double.parseDouble(request.getParameter("x"));
            double y = Double.parseDouble(request.getParameter("y"));
            double r = Double.parseDouble(request.getParameter("r"));

            long startTime = System.nanoTime();
            boolean result = checkHit(x, y, r);
            long executionTime = System.nanoTime() - startTime;

            Result resultObj = new Result(x, y, r, result, new Date(), executionTime);
            HttpSession session = request.getSession(false);
            List<Result> results = (List<Result>) session.getAttribute("results");
            if (results == null) {
                results = new ArrayList<>();
            }
            results.add(resultObj);
            session.setAttribute("results", results);

            request.setAttribute("result", resultObj);

            request.getRequestDispatcher("/result.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid parameters");
        }
    }

    private boolean checkHit(double x, double y, double r) {
        // Проверка попадания в круг
        if (x >= 0 && y >= 0 && (x*x + y*y) <= r*r) {
            return true;
        }

        // Проверка попадания в треугольник
        if (x <= 0 && y <= 0 && y >= -x - r) {
            return true;
        }

        // Проверка попадания в прямоугольник
        if (x >= 0 && y <= 0 && x <= r && y >= -r/2) {
            return true;
        }

        return false;
    }
}