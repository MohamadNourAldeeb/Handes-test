import helmet from "helmet";

export default (app) => {
    app.use(helmet());

    // Configure HSTS options
    const hstsOptions = {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    };

    // Apply HSTS configuration
    app.use(helmet.hsts(hstsOptions));

    // Apply XSS filter
    app.use(helmet.xssFilter());

    // Disable X-Powered-By header
    app.use(helmet.hidePoweredBy());

    // Prevent MIME type sniffing
    app.use(helmet.noSniff());

    // helps prevent clickjacking attacks by controlling which websites can embed my proj content in frames
    app.use(
        helmet.frameguard({
            action: "deny", // or 'sameorigin'
        })
    );
};
