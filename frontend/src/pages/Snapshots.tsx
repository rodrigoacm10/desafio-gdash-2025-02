export const Snapshots = () => {
  // ({ snapshot })

  return (
    <div>
      <p className="text-3xl font-bold text-[#156e6a]">Users</p>
      <p className="text-accent-foreground mb-6">users registred on system</p>

      <div className="flex flex-col gap-2">
        <div className="cursor-pointer border px-5 py-4 rounded-2xl flex justify-between">
          <div>
            <div>
              <p className="text-[#156e6a] text-xl font-bold mb-1">
                {/* snapshot.fetchedAt */}
                28/11/2025
              </p>
              <p className="font-medium text-[#156e6a]/80">
                Recife, Pernambuco - BR
              </p>
              <p className="text-sm mt-1 text-muted-foreground">
                lat: <span className="font-bold"> -34.0209342 </span> - lon:
                <span className="font-bold"> -23.2980293</span>
              </p>
            </div>

            <div className="text-sm mt-2 text-muted-foreground">
              <p>
                Current temp: <span className="font-bold"> 33 °C </span> - Feels
                like: <span className="font-bold"> 33 °C </span> - Condition
                <span className="font-bold"> something </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
