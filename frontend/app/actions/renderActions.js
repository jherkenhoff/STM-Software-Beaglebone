export const START_VORONOI_RENDER = "START_VORONOI_RENDER"
export const SET_VORONOI_RENDER_STATUS = "SET_VORONOI_RENDER_STATUS"

export const SET_VORONOI_RENDER_RESULTS = "SET_VORONOI_RENDER_RESULTS"



export function startVoronoiRender() {
  return {type: START_VORONOI_RENDER}
}

export function setVoronoiRenderStatus(computing) {
  return {type: SET_VORONOI_RENDER_STATUS, computing}
}

export function setVoronoiRenderResults(cells) {
  return {type: SET_VORONOI_RENDER_RESULTS, cells}
}
