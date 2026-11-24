/** @type {import('next').NextConfig} */
module.exports = {
  // Bundle the resume PDF into the /api/resume serverless function (Netlify).
  outputFileTracingIncludes: {
    "/api/resume": ["./public/Hod_Mitrany_Resume.pdf"],
  },
};
