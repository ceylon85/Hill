export class Sun {
  constructor() {
    this.radius = 100;
    //60개의 좌표를 가짐
    this.total = 60;
    this.gap = 1/this.total;
    this.originPos = [];
    this.pos = [];
    for(let i = 0; i< this.total; i++){
        //비율은 1/total에 현재값을 곱한다.
        const pos = this.getCirclePoint(this.radius, this.gap * i);
        this.originPos[i] = pos;
        this.pos[i] = pos;
    }
    //fps정의
    this.fps = 30;
    this.fpsTime = 1000/this.fps;
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.x = this.stageWidth - this.radius - 160;
    this.y = this.radius + 30;
  }

  draw(ctx, t) {
    if(!this.time){
        this.time = t;
    }
    const now = t-this.time;
    if(now > this.fpsTime){
        this.time = t;
        this.updatePoints();
    }

    ctx.fillStyle = "#ffb200";
    ctx.beginPath();
    let pos = this.pos[0];
    //업데이트된 좌표를 서로 선으로 연결
    ctx.moveTo(pos.x + this.x, pos.y + this.y);
    for( let i = 1; i<this.total; i++){
        const pos = this.pos[i];
        ctx.lineTo(pos.x + this.x, pos.y + this.y);
    }
    ctx.fill();
  }
  //저장된 좌표에 랜덤값을 더한 좌표를 생성
  //랜덤값으로 해가 움직이는 표현을 한다.
  updatePoints(){
      for(let i = 1; i < this.total; i++){
          const pos = this.originPos[i];
          this.pos[i] = {
              x: pos.x + this.ranInt(5),
              y: pos.y + this.ranInt(5)
          }
      }
  }

  ranInt(max) {
      return Math.random() * max;
  }
  //원 위의 좌표
  getCirclePoint(radius, t) {
    const theta = Math.PI * 2 * t;
    return {
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius,
    };
  }
}
