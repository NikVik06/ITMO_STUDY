package ui;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.JspWriter;
import jakarta.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

public class AlertTag extends SimpleTagSupport {
    private String type;
    private String title;
    private Boolean closable = false;
    private Boolean icon = true;



    public void setType(String type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setClosable(Boolean closable) { this.closable = closable != null ? closable : false; }
    public void setIcon(Boolean icon) { this.icon = icon != null ? icon : true; }

    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();

        String iconSymbol = getIconSymbol();
        String alertId = "alert-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
        out.print("<div class=\"alert alert-" + escapeHtml(type) + "\" id=\"" + alertId + "\">");
        out.print("<div class=\"alert-header\">");
        if (icon) {
            out.print("<span class=\"alert-icon\">" + iconSymbol + "</span>");
        }
        out.print("<strong class=\"alert-title\">" + escapeHtml(title) + "</strong>");
        if (closable) {
            out.print("<button class=\"alert-close\" onclick=\"closeAlert('" + alertId + "')\">×</button>");
        }
        out.print("</div>");
        out.print("<div class=\"alert-body\">");
        if (getJspBody() != null) {
            getJspBody().invoke(out);
        }
        out.print("</div>");

        out.print("</div>");
    }

    private String getIconSymbol() {
        switch (type) {
            case "success": return "✓";
            case "error": return "✗";
            case "warning": return "⚠️";
            case "info": return "ℹ️";
            default: return "";
        }
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}