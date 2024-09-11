export default function Page() {
  return (
    <>
      <iframe
        plausible-embed
        src="https://analytics.andreg.com.br/share/eventos.gexapeco.com?auth=00gG4_0bLZ5g6WCBZ3UIF&embed=true&theme=system"
        frameBorder="0"
        loading="lazy"
        // style="width: 1px; min-width: 100%; height: 1600px;"
        className="h-[1600px] w-full overflow-auto"
      ></iframe>
      <script
        async
        src="https://analytics.andreg.com.br/js/embed.host.js"
      ></script>
    </>
  )
}
