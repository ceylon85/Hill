export class Sheep {
  constructor(img, stageWidth) {
    this.img = img;
    //미리 그려둔 양의 frame에 맞춰 8로 한다.
    this.totalFrame = 8;
    this.curFrame = 0;
    //이미지 크기는 양 그림 한장의 넓이와 높이
    this.imgWidth = 360;
    this.imgHeight = 300;
    //양의 크기는 디스플레이를 고려 절반 사이즈
    this.sheepWidth = 180;
    this.sheepHeight = 150;

    this.sheepWidthHalf = this.sheepWidth / 2;
    this.x = stageWidth + this.sheepWidth;
    this.y = 0;
    //속도는 랜덤으로 정의
    this.speed = Math.random() * 2 + 1;
    //실제 타임스태프와 비교 값
    this.fps = 24;
    this.fpsTime = 1000 / this.fps;
  }

  draw(ctx, t, dots) {
    if (!this.time) {
      this.time = t;
    }
    //현재 프레임을 증가시키고 프레임에 맞춰 양의 이미지에서 
    //해당 프레임에 맞는 이미지를 가져와 양이 움직이는 이미지를 만든다
    const now = t - this.time;
    if (now > this.fpsTime) {
      this.time = t;
      this.curFrame += 1;
      if (this.curFrame == this.totalFrame) {
        this.curFrame = 0;
      }
    }
 
    this.animate(ctx, dots);
  }

  animate(ctx, dots) {
    //양의 x값을 스테이지 넓이에 양의 넓이를 더한만큼을 초기값으로 지정하고 속도를 계속 뺀다.
    this.x -= this.speed;
    const closest = this.getY(this.x, dots);
    this.y = closest.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    //곡선의 기울기를 가져온 공식을 이용해 캔버스를 회전
    ctx.rotate(closest.rotation);
    ctx.drawImage(
      this.img,
      this.imgWidth * this.curFrame,
      0,
      this.imgWidth,
      this.imgHeight,
      -this.sheepWidthHalf,
      -this.sheepHeight + 20,
      this.sheepWidth,
      this.sheepHeight
    );
    //저장했던 캔버스를 복귀
    ctx.restore();
  }
  //어떤 곡선이 x에 해당하는지 확인
  getY(x, dots) {
    for (let i = 1; i < dots.length; i++) {
      if (x >= dots[i].x1 && x <= dots[i].x3) {
        return this.getY2(x, dots[i]);
      }
    }
    return {
      y: 0,
      rotation: 0,
    };
  }
  //200개의 비율로 곡선을 나눈다
  getY2(x, dot) {
    const total = 200;
    let pt = this.getPointOnQuad(
      dot.x1,
      dot.y1,
      dot.x2,
      dot.y2,
      dot.x3,
      dot.y3,
      0
    );
    let prevX = pt.x;
    for (let i = 1; i < total; i++) {
      const t = i / total;
      pt = this.getPointOnQuad(
        dot.x1,
        dot.y1,
        dot.x2,
        dot.y2,
        dot.x3,
        dot.y3,
        t
      );
      //x값과 가장 근사치에 속한 값을 가져온다
      if (x >= prevX && x <= pt.x) {
        return pt;
      }
      prevX = pt.x;
    }
    return pt;
  }

  getQuadValue(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
    const tx = this.quadTangent(x1, x2, x3, t);
    const ty = this.quadTangent(y1, y2, y3, t);
    //atan2를 사용해서 수직의 각도를 가져온다 
    //수평으로 변환하기 위해 90도를 더한다
    const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
    return {
      x: this.getQuadValue(x1, x2, x3, t),
      y: this.getQuadValue(y1, y2, y3, t),
      rotation: rotation,
    };
  }
  //양이 언덕의 기울기에 따라 회전
  quadTangent(a, b, c, t) {
    return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
  }
}
