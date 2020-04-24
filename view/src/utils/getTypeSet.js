function getTypeSet(pa){
    const flows = pa.map( _ => _.flow).flat()
    //use all type for pitcher pitchtype barchart
    const pitchTypes = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"]
    const pitchTypeCountMap = new Map(pitchTypes.map(_ => [_, 0]))
  
    flows.forEach(_ => {
      const newCount = pitchTypeCountMap.get(_.typeCode) + 1;
      pitchTypeCountMap.set(_.typeCode, newCount)
    })
    //console.log("AAAAAAAA ", pitchTypeCountMap)
    return pitchTypes.map(_ => [_, pitchTypeCountMap.get(_) / flows.length])
    .filter(_ => _[1] > 0.001);
  }

export default getTypeSet;