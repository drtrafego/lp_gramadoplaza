import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/modelo-1-cinematografico",
        destination: "/",
        permanent: true,
      },
      {
        source: "/modelo-1-cinematografico.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/modelo-3-scroll-storytelling",
        destination: "/cardapio",
        permanent: true,
      },
      {
        source: "/modelo-3-scroll-storytelling.html",
        destination: "/cardapio",
        permanent: true,
      },
      {
        source: "/modelo-2-galeria-imersiva",
        destination: "/",
        permanent: true,
      },
      {
        source: "/modelo-2-galeria-imersiva.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
