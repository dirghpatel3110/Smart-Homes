package servlets;

import utilities.AjaxUtility;
import org.json.JSONArray;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/autocomplete")
public class AutoCompleteServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");
        String searchId = request.getParameter("searchId");
        
        if (action.equals("complete")) {
            JSONArray jsonArray = AjaxUtility.readProductsAutocomplete(searchId);
            out.print(jsonArray.toString());
        }
        out.flush();
    }
}