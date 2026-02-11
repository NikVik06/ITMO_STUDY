import React, { useRef, useEffect, useState } from 'react';

function Graph({ results, currentRValues, onCanvasClick }) {
  const canvasRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  const getDisplayMode = () => {
    if (windowWidth < 728) return 'mobile';
    if (windowWidth < 1174) return 'tablet';
    return 'desktop';
  };

  const displayMode = getDisplayMode();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getScale = () => {
      switch (displayMode) {
        case 'mobile': return 30;
        case 'tablet': return 35;
        case 'desktop': return 40;
        default: return 40;
      }
    };

  const getCenter = () => {
      switch (displayMode) {
        case 'mobile': return 150;
        case 'tablet': return 175;
        case 'desktop': return 200;
        default: return 200;
      }
    };

  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const SCALE = getScale();
      const CENTER = getCenter();

      ctx.clearRect(0, 0, 400, 400);
      drawAxes(ctx, SCALE, CENTER);

      if (currentRValues && currentRValues.length > 0) {
        currentRValues.forEach(r => {
          if (r > 0) {
            drawShapes(ctx, r, SCALE, CENTER);
          }
        });
      }

      results.forEach(point => {
        drawPoint(ctx, point, SCALE, CENTER, windowWidth, currentRValues);
      });
    }, [results, currentRValues, windowWidth, displayMode]);

  const handleClick = (e) => {
    if (!currentRValues || currentRValues.length === 0) {
      alert('Сначала выберите радиус R для проверки точки');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const SCALE = getScale();
    const CENTER = getCenter();

    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const graphX = (x - CENTER) / SCALE;
    const graphY = (CENTER - y) / SCALE;

    const roundedX = Math.round(graphX * 100) / 100;
    const roundedY = Math.round(graphY * 100) / 100;

    console.log(`Canvas click: graph(${roundedX},${roundedY})`);
    onCanvasClick(roundedX, roundedY);
  };

  const drawAxes = (ctx, SCALE, CENTER) => {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#2c3e50';

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, CENTER);
    ctx.lineTo(400, CENTER);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(CENTER, 0);
    ctx.lineTo(CENTER, 400);
    ctx.stroke();

    // Стрелки
    ctx.beginPath();
    ctx.moveTo(390, CENTER - 5);
    ctx.lineTo(400, CENTER);
    ctx.lineTo(390, CENTER + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(CENTER - 5, 10);
    ctx.lineTo(CENTER, 0);
    ctx.lineTo(CENTER + 5, 10);
    ctx.fill();

    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        const x = CENTER + i * SCALE;
        ctx.beginPath();
        ctx.moveTo(x, CENTER - 5);
        ctx.lineTo(x, CENTER + 5);
        ctx.stroke();
        ctx.fillText(i.toString(), x, CENTER + 10);
      }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = -5; i <= 5; i++) {
      if (i !== 0) {
        const y = CENTER - i * SCALE;
        ctx.beginPath();
        ctx.moveTo(CENTER - 5, y);
        ctx.lineTo(CENTER + 5, y);
        ctx.stroke();
        ctx.fillText(i.toString(), CENTER - 10, y);
      }
    }

    ctx.fillStyle = '#2c3e50';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Y', CENTER - 10, 20);
    ctx.textAlign = 'left';
    ctx.fillText('X', 390, CENTER - 10);
  };

  const drawShapes = (ctx, r, SCALE, CENTER) => {
    if (!r || r <= 0) {
      return;
    }
    const scaleR = r * SCALE;
    const scaleRHalf = (r / 2) * SCALE;

    const alpha = 0.2 / (currentRValues ? currentRValues.length : 1);
    ctx.fillStyle = `rgba(52, 152, 219, ${alpha})`;
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 1;

    // Круг
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, scaleRHalf, -Math.PI / 2, 0, false);
    ctx.lineTo(CENTER, CENTER);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Треугольник
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.lineTo(CENTER - scaleR, CENTER);
    ctx.lineTo(CENTER, CENTER - scaleR);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Прямоугольник
    ctx.beginPath();
    ctx.rect(CENTER - scaleRHalf, CENTER, scaleRHalf, scaleR);
    ctx.fill();
    ctx.stroke();
  };

  const drawPoint = (ctx, point, SCALE, CENTER, windowWidth, currentRValues) => {
    const pointX = CENTER + point.x * SCALE;
    const pointY = CENTER - point.y * SCALE;

    const isCurrentR = currentRValues && currentRValues.includes(point.r);

    let color;
    if (isCurrentR) {
      color = point.hit ? '#27ae60' : '#e74c3c';
    } else {
      color = point.hit ? 'rgba(39, 174, 96, 0.5)' : 'rgba(231, 76, 60, 0.5)';
    }

    const radius = (windowWidth < 728) ? 3 : (isCurrentR ? 6 : 4);

    ctx.beginPath();
    ctx.arc(pointX, pointY, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const hasCurrentRValues = currentRValues && currentRValues.length > 0;

  return (
    <div className="graph-container">
      <h3>
              Область проверки {currentRValues && currentRValues.length > 0
                ? `(R = ${currentRValues.join(', ')})`
                : ''}
              <span className="display-mode-badge">
                ({displayMode === 'mobile' ? 'Мобильный' :
                  displayMode === 'tablet' ? 'Планшетный' : 'Десктопный'} режим)
              </span>
            </h3>

      <canvas
        ref={canvasRef}
        width="400"
        height="400"
        onClick={handleClick}
        className="area-canvas"
        style={{ cursor: hasCurrentRValues ? 'crosshair' : 'not-allowed' }}
      />

      <p className="graph-hint">
        {hasCurrentRValues
          ? 'Кликните на график для проверки точки с текущим R'
          : 'Выберите радиус R для проверки точки'}
      </p>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
          <span>Попадание (текущий R)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
          <span>Промах (текущий R)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(39, 174, 96, 0.5)' }}></div>
          <span>Попадание (другой R)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(231, 76, 60, 0.5)' }}></div>
          <span>Промах (другой R)</span>
        </div>
      </div>
    </div>
  );
}

export default Graph;