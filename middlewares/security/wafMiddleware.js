import easyWaf from "easy-waf";
import { logMaliciousUser } from "../../utils/helper.js";
import { WafErrorsToDevelopers } from "../../utils/nodemailer.js";

const wafMiddleware = async (req, res, next) => {
    try {
        const forwardedIp = req.headers["x-forwarded-for"] || req.ip;
        const defaultOptions = {
            dryMode: false,
            ipBlacklist: [],
            ipWhitelist: [],
            modules: {
                sqlInjection: { enabled: true },
                commandInjection: { enabled: true },
                fileUpload: { enabled: true },
            },

            postBlockHook: (fak_req, moduleName, ip) => {
                try {
                    let moreData = {
                        visitedPath: req.originalUrl,
                        method: req.method,
                        bodySize: JSON.stringify(req.body).length,
                        querySize: JSON.stringify(req.query).length,
                        Body: req.body,
                        Query: req.query,
                        Params: req.params,
                        path: req.path,
                    };
                    logMaliciousUser(req, "bad_person", moreData);

                    WafErrorsToDevelopers({
                        ip: forwardedIp,
                        moduleName,
                        url: req.url,
                        method: req.method,
                        query: req.query,
                        body: req.body,
                        headers: req.headers,
                    });
                } catch (error) {
                    console.error("Error in postBlockHook:", error);
                }
            },
        };
        const finalOptions = { ...defaultOptions };
        await easyWaf(finalOptions)(req, res, next);
    } catch (error) {
        console.error("Error in wafMiddleware:", error);
        next(error);
    }
};

export default wafMiddleware;
