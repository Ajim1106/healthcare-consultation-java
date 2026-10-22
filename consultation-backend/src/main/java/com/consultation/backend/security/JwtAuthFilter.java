package com.consultation.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Public paths — skip JWT check entirely
    private final List<String> PUBLIC_PATHS = List.of(
        "/api/login",
        "/api/register/**",
        "/api/doctor/getAllDoctors",
        "/api/doctor/getDoctorById/**",
        "/api/doctor/doctorByName/**",
        "/api/doctor/check-email",
        "/api/patient/check-email"
    );

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        // Skip filter for OPTIONS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;
        // Skip filter for all public paths
        return PUBLIC_PATHS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    String email = jwtUtil.extractEmail(token);
                    String role  = jwtUtil.extractRole(token);

                    if (email != null && role != null &&
                            SecurityContextHolder.getContext().getAuthentication() == null) {

                        var authority = new SimpleGrantedAuthority("ROLE_" + role.toLowerCase());
                        var auth = new UsernamePasswordAuthenticationToken(
                                email, null, List.of(authority)
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // Invalid token — just continue without setting auth
                // Spring Security will handle the 401 via .anyRequest().authenticated()
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
