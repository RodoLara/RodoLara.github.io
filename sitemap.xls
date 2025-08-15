<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">

  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat"/>

  <xsl:template name="styles">
    <style>
      html { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Arial, sans-serif; }
      body { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
      h1 { font-size: 1.9rem; margin: 0 0 .5rem; }
      .meta { color: #666; margin-bottom: 1rem; }
      .pill { display:inline-block; padding:.2rem .5rem; border:1px solid #e5e7eb; border-radius:999px; font-size:.8rem; color:#374151; margin-right:.5rem; }
      .section { margin-top: 1.25rem; }
      table { width:100%; border-collapse: collapse; margin-top:.5rem; }
      th, td { padding:.6rem .7rem; border-bottom:1px solid #eee; vertical-align:top; }
      th { text-align:left; background:#fafafa; font-weight:600; }
      tr:hover td { background:#f8fbff; }
      .muted { color:#777; }
      .nowrap { white-space: nowrap; }
      @media (max-width:720px){ .hide-sm{display:none;} th,td{padding:.5rem;} }
    </style>
  </xsl:template>

  <!-- Root: urlset -->
  <xsl:template match="/">
    <html lang="es">
      <head>
        <meta charset="utf-8"/>
        <title>XML Sitemap · rodolfolara.com</title>
        <xsl:call-template name="styles"/>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <div class="meta">
          Vista legible para humanos. Los motores de búsqueda ignoran esta hoja XSL y consumen el XML.
        </div>

        <div class="pill">URLs totales: <xsl:value-of select="count(/s:urlset/s:url)"/></div>

        <!-- Sección EN -->
        <div class="section">
          <h2>English (/en)</h2>
          <xsl:call-template name="url-table">
            <xsl:with-param name="nodes" select="/s:urlset/s:url[starts-with(s:loc,'https://www.rodolfolara.com/en/')]"/>
          </xsl:call-template>
        </div>

        <!-- Sección ES -->
        <div class="section">
          <h2>Español (/es)</h2>
          <xsl:call-template name="url-table">
            <xsl:with-param name="nodes" select="/s:urlset/s:url[starts-with(s:loc,'https://www.rodolfolara.com/es/')]"/>
          </xsl:call-template>
        </div>

        <!-- Otras rutas (por si en el futuro hay algo fuera de /en o /es) -->
        <xsl:if test="/s:urlset/s:url[not(starts-with(s:loc,'https://www.rodolfolara.com/en/')) and not(starts-with(s:loc,'https://www.rodolfolara.com/es/'))]">
          <div class="section">
            <h2>Otros</h2>
            <xsl:call-template name="url-table">
              <xsl:with-param name="nodes" select="/s:urlset/s:url[not(starts-with(s:loc,'https://www.rodolfolara.com/en/')) and not(starts-with(s:loc,'https://www.rodolfolara.com/es/'))]"/>
            </xsl:call-template>
          </div>
        </xsl:if>
      </body>
    </html>
  </xsl:template>

  <!-- Tabla generica -->
  <xsl:template name="url-table">
    <xsl:param name="nodes"/>
    <table>
      <thead>
        <tr>
          <th style="width:60%">URL</th>
          <th class="hide-sm">Lastmod</th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="$nodes">
          <tr>
            <td>
              <a target="_blank" rel="noopener">
                <xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute>
                <xsl:value-of select="s:loc"/>
              </a>
            </td>
            <td class="nowrap">
              <xsl:choose>
                <xsl:when test="normalize-space(s:lastmod)!=''"><xsl:value-of select="s:lastmod"/></xsl:when>
                <xsl:otherwise><span class="muted">—</span></xsl:otherwise>
              </xsl:choose>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>

</xsl:stylesheet>
