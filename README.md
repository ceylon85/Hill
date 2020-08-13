# hill
![hill](https://user-images.githubusercontent.com/45006553/90096516-6fcbf500-dd6e-11ea-938e-52532408d202.gif)
# 
# 언덕을 올라가는 양
Link to 
[Demo](https://ceylon85.github.io/Hill/)
## 1. 곡선으로 언덕 그리기   
#### hill.js
> 일정간격을 가진 좌표값에 곡선을 줘서 언덕처럼 보이게 만든다.
```JS
draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    let cur = this.points[0];
    let prev = cur;

    //곡선의 좌표를 양의 좌표를 찾는데 사용하기 위해 배열에 저장
    let dots = [];
    //포인트를 시작
    ctx.moveTo(cur.x, cur.y);

    let prevCx = cur.x;
    let prevCy = cur.y;

    for (let i = 1; i < this.points.length; i++) {
      cur = this.points[i];

      const cx = (prev.x + cur.x) / 2;
      const cy = (prev.y + cur.y) / 2;
      //곡선을 그리는데 사용한 함수 (제어점x, 제어점y, 종료점x, 종료점y)
      ctx.quadraticCurveTo(prev.x, prev.Y, cx, cy);

      dots.push({
        x1: prevCx, y1: prevCy,
        x2: prev.x, y2: prev.y,
        x3: cx, y3: cy,
      });

      prev = cur;
      prevCx = cx;
      prevCy = cy;
    }

    ctx.lineTo(prev.x, prev.y);
    ctx.lineTo(this.stageWidth, this.stageHeight);
    ctx.lineTo(this.points[0].x, this.stageHeight);
    ctx.fill();

    return dots;
  }
```
# 
## 2. 뎁스에 따라 속도가 다른 연출   
#### App.js
>뒤에 있는 언덕의 속도를 느리게 하고 앞에 있는 언덕의 속도를 빠르게 설정   
```JS 
this.hills = [
      new Hill("#fd6bea", 0.2, 12),
      new Hill("#ff59c2", 0.5, 8),
      new Hill("#ff4674", 1.4, 6),
    ];
```
#### hill.js
> x좌표에 스피드를 더해 언덕을 움직이게 한다
```JS
cur.x += this.speed;
```
> x좌표의 시작점이 화면 밖에 나오기 전에 새로운 언덕을 배열 앞에 추가   
```JS
//화면이 일정영역 이상에서 사라지면 배열에서 빼줘서 배열을 관리
if (cur.x > -this.gap) {
      this.points.unshift({
        x: -(this.gap * 2),
        y: this.getY(),
      });
    } else if (cur.x > this.stageWidth + this.gap) {
      this.points.splice(-1);
    }
```
# 
## 3. 이미지 스프라이트 기법(양이 걸어가는 것)
>여러개의 이미지를 하나의 이미지로 합쳐서 이미지 좌표와 크기를 기준으로 보여줌
# 
## 4. 애니메이션 속도를 맞추기 위해 FPS를 코드에 적용
#### sheep.js
```JS
 const now = t - this.time;
//fps 시간과 비교해서 그 시간에 도달했을 때만 프레임을 증가시킨다.
    if (now > this.fpsTime) {
      this.time = t;
      this.curFrame += 1;
      if (this.curFrame == this.totalFrame) {
        this.curFrame = 0;
      }
    }
```
# 
## 5. 곡선위의 좌표와 각도 찾기 
`양이 곡선을 따라가도록 곡선위의 좌표를 따라가는 수학 공식`
#### sheep.js
>언덕의 곡선에 내가 원하는 좌표를 찾고 양이 언덕의 기울기에 따라 회전
```JS
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
```
# 
## 6. 선이(해가) 지글지글 거리는 스케치 효과
>지정된 좌표에 랜덤값을 더한 좌표를 생성하고 랜덤닶으로 해가 움직이는 표현
#### sun.js
```JS
//원의 좌표를 가져온다.
getCirclePoint(radius, t) {
    const theta = Math.PI * 2 * t;
    return {
      x: Math.cos(theta) * radius,
      y: Math.sin(theta) * radius,
    };
  }
//지정된 좌표에 랜덤값을 더한 좌표를 생성하고 랜덤값으로 해가 움직이는 표현을 한다.
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
//업데이트된 좌표를 서로 선으로 연결
    ctx.moveTo(pos.x + this.x, pos.y + this.y);
    for( let i = 1; i<this.total; i++){
        const pos = this.pos[i];
        ctx.lineTo(pos.x + this.x, pos.y + this.y);
    }
    ctx.fill();
```
