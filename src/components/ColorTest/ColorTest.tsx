import React, { useState } from 'react';
import styles from './ColorTest.module.css';

interface ColorTestProps {
  /** Mostrar etiquetas con información de cada color */
  showLabels?: boolean;
  /** Tamaño de los cuadros de color */
  size?: 'small' | 'medium' | 'large';
}

const ColorTest = ({ showLabels = true, size = 'medium' }: ColorTestProps) => {
  const [activeTest, setActiveTest] = useState<string | null>(null);

  // Colores problemáticos para cámaras
  const problematicColors = [
    {
      name: 'Chroma Green',
      color: '#00FF00',
      description: 'Verde croma puro - Problemático para sensores',
      category: 'chroma'
    },
    {
      name: 'Pure Red',
      color: '#FF0000',
      description: 'Rojo puro - Puede saturar sensores',
      category: 'saturation'
    },
    {
      name: 'Pure Blue',
      color: '#0000FF',
      description: 'Azul puro - Problemas en baja luz',
      category: 'saturation'
    },
    {
      name: 'Hot Pink',
      color: '#FF00FF',
      description: 'Magenta puro - Fuera de gamut natural',
      category: 'synthetic'
    },
    {
      name: 'Cyber Yellow',
      color: '#FFFF00',
      description: 'Amarillo puro - Muy brillante',
      category: 'brightness'
    },
    {
      name: 'Pure Cyan',
      color: '#00FFFF',
      description: 'Cian puro - Problemático en LCD',
      category: 'synthetic'
    },
    {
      name: 'Deep Purple',
      color: '#4B0082',
      description: 'Púrpura profundo - Límite del espectro visible',
      category: 'spectrum'
    },
    {
      name: 'Neon Orange',
      color: '#FF4500',
      description: 'Naranja neón - Alta saturación',
      category: 'saturation'
    },
    {
      name: 'Electric Lime',
      color: '#CCFF00',
      description: 'Lima eléctrico - Color sintético',
      category: 'synthetic'
    },
    {
      name: 'Hot Magenta',
      color: '#FF1493',
      description: 'Magenta caliente - Muy saturado',
      category: 'saturation'
    },
    {
      name: 'Pure White',
      color: '#FFFFFF',
      description: 'Blanco puro - Puede causar blown highlights',
      category: 'brightness'
    },
    {
      name: 'Pure Black',
      color: '#000000',
      description: 'Negro puro - Pérdida de detalle',
      category: 'brightness'
    }
  ];

  // Colores para seguridad - Interferencia con algoritmos de cámara
  const securityColors = [
    {
      name: 'Frequency Killer',
      color: '#808080',
      description: 'Gris que interfiere con algoritmos de detección',
      category: 'algorithm'
    },
    {
      name: 'Face Detection Blocker',
      color: '#C0C0C0',
      description: 'Gris claro que confunde reconocimiento facial',
      category: 'detection'
    },
    {
      name: 'Auto-Focus Breaker',
      color: '#404040',
      description: 'Gris oscuro que impide que la cámara enfoque',
      category: 'focus'
    },
    {
      name: 'Exposure Confusion',
      color: '#BEBEBE',
      description: 'Gris medio que confunde medición de luz',
      category: 'exposure'
    },
    {
      name: 'White Balance Killer',
      color: '#999999',
      description: 'Gris que rompe el balance de blancos automático',
      category: 'balance'
    },
    {
      name: 'Compression Artifact',
      color: '#7F7F7F',
      description: 'Gris que causa artifacts en compresión JPEG',
      category: 'compression'
    },
    {
      name: 'Contrast Destroyer',
      color: '#A0A0A0',
      description: 'Gris que elimina contraste en la imagen',
      category: 'contrast'
    },
    {
      name: 'Detail Eliminator',
      color: '#909090',
      description: 'Gris que hace que se pierdan detalles',
      category: 'detail'
    }
  ];

  // Patrones de prueba adicionales
  const testPatterns = [
    {
      name: 'Gradient Test',
      id: 'gradient',
      description: 'Gradiente para probar banding'
    },
    {
      name: 'Checkerboard',
      id: 'checkerboard',
      description: 'Patrón de ajedrez para probar moiré'
    },
    {
      name: 'Fine Lines',
      id: 'lines',
      description: 'Líneas finas para probar resolución'
    },
    {
      name: 'CV Dazzle',
      id: 'cvdazzle',
      description: 'Patrón que confunde reconocimiento facial'
    },
    {
      name: 'Adversarial Pattern',
      id: 'adversarial',
      description: 'Patrón que confunde algoritmos de IA'
    },
    {
      name: 'Focus Breaker',
      id: 'focusbreaker',
      description: 'Patrón que impide que la cámara enfoque'
    }
  ];

  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  return (
    <div className={styles.colorTest}>
      <div className={styles.header}>
        <h2>🎨 Color Test para Cámara</h2>
        <p>Componente para probar colores problemáticos con cámaras de celular</p>
      </div>

      {/* Grid de colores problemáticos */}
      <div className={styles.section}>
        <h3>Colores Problemáticos</h3>
        <div className={`${styles.colorGrid} ${getSizeClass()}`}>
          {problematicColors.map((item) => (
            <button
              key={item.name}
              className={styles.colorItem}
              onClick={() => setActiveTest(activeTest === item.name ? null : item.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTest(activeTest === item.name ? null : item.name);
                }
              }}
              aria-label={`Probar color ${item.name}: ${item.description}`}
              type="button"
            >
              <div
                className={styles.colorSquare}
                style={{ backgroundColor: item.color }}
                title={item.description}
              />
              {showLabels && (
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>{item.name}</span>
                  <span className={styles.colorCode}>{item.color}</span>
                  <span className={styles.colorCategory}>{item.category}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de colores de seguridad anti-cámara */}
      <div className={styles.section}>
        <h3>🔒 Colores de Seguridad (Anti-Cámara)</h3>
        <div className={`${styles.colorGrid} ${getSizeClass()}`}>
          {securityColors.map((item) => (
            <button
              key={item.name}
              className={styles.colorItem}
              onClick={() => setActiveTest(activeTest === item.name ? null : item.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTest(activeTest === item.name ? null : item.name);
                }
              }}
              aria-label={`Probar color de seguridad ${item.name}: ${item.description}`}
              type="button"
            >
              <div
                className={styles.colorSquare}
                style={{ backgroundColor: item.color }}
                title={item.description}
              />
              {showLabels && (
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>{item.name}</span>
                  <span className={styles.colorCode}>{item.color}</span>
                  <span className={styles.colorCategory}>{item.category}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Patrones de prueba */}
      <div className={styles.section}>
        <h3>Patrones de Prueba</h3>
        <div className={styles.patternGrid}>
          {testPatterns.map((pattern) => (
            <button
              key={pattern.id}
              className={`${styles.patternButton} ${activeTest === pattern.id ? styles.active : ''}`}
              onClick={() => setActiveTest(activeTest === pattern.id ? null : pattern.id)}
            >
              {pattern.name}
              <small>{pattern.description}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Área de prueba activa */}
      {activeTest && (
        <div className={styles.testArea}>
          <h3>Prueba Activa: {activeTest}</h3>
          {activeTest === 'gradient' && (
            <div className={styles.gradientTest}>
              <div className={styles.gradientRGB}></div>
              <div className={styles.gradientGray}></div>
            </div>
          )}
          {activeTest === 'checkerboard' && (
            <div className={styles.checkerboard}></div>
          )}
          {activeTest === 'lines' && (
            <div className={styles.fineLines}></div>
          )}
          {activeTest === 'cvdazzle' && (
            <div className={styles.cvDazzle}></div>
          )}
          {activeTest === 'adversarial' && (
            <div className={styles.adversarialPattern}></div>
          )}
          {activeTest === 'focusbreaker' && (
            <div className={styles.focusBreaker}></div>
          )}
          {(problematicColors.find(c => c.name === activeTest) || securityColors.find(c => c.name === activeTest)) && (
            <div
              className={styles.fullScreenColor}
              style={{ 
                backgroundColor: problematicColors.find(c => c.name === activeTest)?.color || 
                               securityColors.find(c => c.name === activeTest)?.color 
              }}
            >
              <div className={styles.colorDetails}>
                <h4>{activeTest}</h4>
                <p>{(problematicColors.find(c => c.name === activeTest) || 
                     securityColors.find(c => c.name === activeTest))?.description}</p>
                <code>{(problematicColors.find(c => c.name === activeTest) || 
                        securityColors.find(c => c.name === activeTest))?.color}</code>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instrucciones */}
      <div className={styles.instructions}>
        <h3>📱 Instrucciones para la prueba</h3>
        <ol>
          <li>Abre la cámara de tu celular</li>
          <li>Apunta hacia esta pantalla</li>
          <li>Haz clic en cada color para verlo en pantalla completa</li>
          <li>Observa cómo se ve cada color en la cámara vs. en pantalla</li>
          <li>Prueba diferentes configuraciones de cámara (HDR, modo nocturno, etc.)</li>
          <li>Toma fotos para comparar después</li>
        </ol>
        
        <div className={styles.tips}>
          <h4>💡 Qué buscar en las fotos:</h4>
          <ul>
            <li><strong>Fotos completamente blancas:</strong> Sobreexposición total del sensor</li>
            <li><strong>Fotos con bandas o glitches:</strong> Sensor confundido por patrones</li>
            <li><strong>Colores distorsionados:</strong> Saturación que cambia todos los colores</li>
            <li><strong>Áreas quemadas:</strong> Zonas completamente sin detalle</li>
            <li><strong>Artifacts digitales:</strong> Líneas, puntos o patrones extraños</li>
            <li><strong>Auto-focus fallido:</strong> Cámara no puede enfocar</li>
          </ul>
        </div>

        <div className={styles.securityTips}>
          <h4>⚠️ Realidad sobre Anti-Fotografía:</h4>
          <p><strong>Las bufandas anti-paparazzi NO funcionan con software.</strong> Usan:</p>
          <ul>
            <li><strong>LEDs infrarrojos:</strong> Que las pantallas no pueden emitir</li>
            <li><strong>Materiales reflectantes:</strong> Que reflejan flash físicamente</li>
            <li><strong>Fibras especiales:</strong> Que interfieren con longitudes de onda específicas</li>
          </ul>
          
          <p><strong>🤔 Lo que SÍ podemos hacer:</strong></p>
          <ul>
            <li><strong>Confundir reconocimiento facial:</strong> Con patrones específicos</li>
            <li><strong>Romper auto-focus:</strong> Con texturas que confunden el enfoque</li>
            <li><strong>Interferir con algoritmos:</strong> Usando patrones adversariales</li>
            <li><strong>Generar artifacts:</strong> En compresión JPEG/video</li>
          </ul>
          
          <div className={styles.warningBox}>
            <h5>� Cómo Funciona el Anti-Paparazzi:</h5>
            <p>Los patrones anti-fotografía funcionan por:</p>
            <ul>
              <li><strong>Sobreexposición:</strong> Colores muy brillantes que saturan el sensor</li>
              <li><strong>Contraste extremo:</strong> Confunde la exposición automática</li>
              <li><strong>Patrones estroboscópicos:</strong> Interfieren con el shutter</li>
              <li><strong>Reflexión direccional:</strong> Crean hotspots que arruinan la foto</li>
              <li><strong>Algoritmos confundidos:</strong> Colores que no pueden procesar bien</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTest;
