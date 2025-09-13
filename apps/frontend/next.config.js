const apiUrl = isProduction
      ? `${process.env.VERCEL_URL || "http://0.0.0.0:3000"}/api/sports-proxy`
      : "http://0.0.0.0:5000";