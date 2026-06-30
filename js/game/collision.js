/**
 * collision.js
 * Pure geometry. No knowledge of Mario, pipes, or game state — just AABB
 * (axis-aligned bounding box) intersection. Keeping this isolated means
 * it's trivially testable and reusable for any future entity pair.
 */
(function (MarioGame) {
  /**
   * @param {{x:number,y:number,width:number,height:number}} a
   * @param {{x:number,y:number,width:number,height:number}} b
   * @returns {boolean}
   */
  function intersects(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  MarioGame.intersects = intersects;
})(window.MarioGame = window.MarioGame || {});
