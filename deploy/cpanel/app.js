// cPanel "Setup Node.js App" startup file (CloudLinux Node.js Selector —
// Phusion Passenger or LiteSpeed). Passenger/LiteSpeed intercept listen(),
// so PORT only matters when this file is run by hand.
//
// Layout (one folder per app, e.g. /home/<user>/pharmway):
//   app.js          <- this file ("Application startup file")
//   package.json    <- empty manifest; the selector manages node_modules here
//   app/            <- Next.js standalone build (has its own node_modules)
//   geoip/          <- optional GeoIP DB (deploy/update-geoip.sh)
const path = require("path");

process.env.NODE_ENV = "production";
// cPanel shells often export the server's own name as HOSTNAME. A specific
// address there makes Next proxy next-intl's internal rewrites to itself and
// fail with 500, so always use server.js's default (0.0.0.0).
delete process.env.HOSTNAME;
process.env.GEOIP_DB_PATH =
  process.env.GEOIP_DB_PATH || path.join(__dirname, "geoip", "dbip-city-lite.mmdb");

require("./app/server.js");
