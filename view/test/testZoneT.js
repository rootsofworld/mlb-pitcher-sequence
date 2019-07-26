/** square to circle
 * u = x √( 1 - ½ y² )
 * v = y √( 1 - ½ x² )
*/

function s2c(sx, sy){
    return {
        cx: sx * Math.sqrt(1 - (sy * sy) / 2),
        cy: sy * Math.sqrt(1 - (sx * sx) / 2)
    }
}
