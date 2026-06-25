'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/lib/api';
import { PERSONA_CONFIG, PERSONA_ORDER } from '@/lib/personas';
import styles from '@/styles/Home.module.css';

// SVG character illustrations drawn in EEnE style
function EdIllustration() {
  return (
    <svg viewBox="0 0 120 160" className={styles.charSvg} aria-label="Ed character">
      {/* Body - big square-ish shape */}
      <rect x="20" y="70" width="80" height="75" rx="4" fill="#4AA15C" />
      {/* Stripe on shirt */}
      <rect x="20" y="95" width="80" height="10" fill="#3A8A4A" />
      {/* Head */}
      <ellipse cx="60" cy="55" rx="38" ry="35" fill="#F5D080" />
      {/* Monobrow */}
      <path d="M 30 38 Q 60 30 90 38" stroke="#5C3A00" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="45" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="75" cy="48" rx="8" ry="9" fill="white" />
      <circle cx="46" cy="50" r="5" fill="#2A1A00" />
      <circle cx="76" cy="50" r="5" fill="#2A1A00" />
      <circle cx="48" cy="48" r="2" fill="white" />
      <circle cx="78" cy="48" r="2" fill="white" />
      {/* Big goofy smile */}
      <path d="M 35 68 Q 60 88 85 68" stroke="#5C3A00" strokeWidth="3" fill="#FF8C8C" />
      {/* Teeth */}
      <rect x="45" y="68" width="10" height="8" rx="1" fill="white" />
      <rect x="57" y="68" width="10" height="8" rx="1" fill="white" />
      {/* Ears */}
      <ellipse cx="22" cy="52" rx="8" ry="9" fill="#F5D080" />
      <ellipse cx="98" cy="52" rx="8" ry="9" fill="#F5D080" />
      {/* Arms */}
      <rect x="0" y="72" width="22" height="40" rx="10" fill="#F5D080" />
      <rect x="98" y="72" width="22" height="40" rx="10" fill="#F5D080" />
      {/* Legs */}
      <rect x="25" y="140" width="28" height="20" rx="4" fill="#5C3A00" />
      <rect x="67" y="140" width="28" height="20" rx="4" fill="#5C3A00" />
    </svg>
  );
}

function EddIllustration() {
  return (
    <svg viewBox="0 0 120 160" className={styles.charSvg} aria-label="Edd character">
      {/* Body - slim */}
      <rect x="32" y="72" width="56" height="72" rx="4" fill="#E8D44D" />
      {/* Shirt collar */}
      <path d="M 45 72 L 60 85 L 75 72" fill="white" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="30" ry="32" fill="#F5D080" />
      {/* Black beanie - Double D's signature */}
      <ellipse cx="60" cy="30" rx="30" ry="16" fill="#1A1A1A" />
      <rect x="30" y="30" width="60" height="14" fill="#1A1A1A" />
      {/* Beanie bottom edge */}
      <rect x="28" y="42" width="64" height="6" rx="2" fill="#111" />
      {/* Eyes - small nervous dots */}
      <ellipse cx="48" cy="56" rx="7" ry="8" fill="white" />
      <ellipse cx="72" cy="56" rx="7" ry="8" fill="white" />
      <circle cx="49" cy="57" r="4" fill="#2A1A00" />
      <circle cx="73" cy="57" r="4" fill="#2A1A00" />
      <circle cx="50" cy="55" r="1.5" fill="white" />
      <circle cx="74" cy="55" r="1.5" fill="white" />
      {/* Small mouth */}
      <path d="M 50 70 Q 60 76 70 70" stroke="#5C3A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="30" cy="54" rx="6" ry="7" fill="#F5D080" />
      <ellipse cx="90" cy="54" rx="6" ry="7" fill="#F5D080" />
      {/* Arms - slim */}
      <rect x="10" y="74" width="24" height="32" rx="10" fill="#F5D080" />
      <rect x="86" y="74" width="24" height="32" rx="10" fill="#F5D080" />
      {/* Legs */}
      <rect x="34" y="138" width="22" height="22" rx="3" fill="#4A6FA5" />
      <rect x="64" y="138" width="22" height="22" rx="3" fill="#4A6FA5" />
    </svg>
  );
}

function EddyIllustration() {
  return (
    <svg viewBox="0 0 120 160" className={styles.charSvg} aria-label="Eddy character">
      {/* Body - short and stocky */}
      <rect x="25" y="78" width="70" height="65" rx="4" fill="#E8D44D" />
      {/* Shirt - blue stripe */}
      <rect x="25" y="94" width="70" height="14" fill="#4A90D9" />
      {/* Head - wide and short */}
      <ellipse cx="60" cy="54" rx="35" ry="30" fill="#F5D080" />
      {/* Spiky hair */}
      <path d="M 28 38 L 34 20 L 42 36 L 50 16 L 58 34 L 66 14 L 74 32 L 82 18 L 88 36 L 92 42" 
            stroke="#5C3A00" strokeWidth="3" fill="#8B5E00" strokeLinejoin="round" />
      {/* Eyes - beady confident */}
      <ellipse cx="46" cy="54" rx="9" ry="9" fill="white" />
      <ellipse cx="74" cy="54" rx="9" ry="9" fill="white" />
      <circle cx="48" cy="55" r="5" fill="#1A1A00" />
      <circle cx="76" cy="55" r="5" fill="#1A1A00" />
      <circle cx="50" cy="53" r="2" fill="white" />
      <circle cx="78" cy="53" r="2" fill="white" />
      {/* Smug smirk */}
      <path d="M 44 70 Q 58 78 74 66" stroke="#5C3A00" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx="25" cy="56" rx="8" ry="8" fill="#F5D080" />
      <ellipse cx="95" cy="56" rx="8" ry="8" fill="#F5D080" />
      {/* Arms */}
      <rect x="2" y="80" width="25" height="35" rx="10" fill="#F5D080" />
      <rect x="93" y="80" width="25" height="35" rx="10" fill="#F5D080" />
      {/* Legs - shorter */}
      <rect x="28" y="138" width="26" height="22" rx="3" fill="#2A5C8A" />
      <rect x="66" y="138" width="26" height="22" rx="3" fill="#2A5C8A" />
    </svg>
  );
}

const ILLUSTRATIONS = { ed: EdIllustration, edd: EddIllustration, eddy: EddyIllustration };

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  async function selectPersona(personaId) {
    setLoading(personaId);
    try {
      const convo = await createConversation(personaId, `Chat with ${PERSONA_CONFIG[personaId].name}`);
      router.push(`/chat/${convo.id}`);
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  }

  return (
    <div className={styles.page}>
      {/* Wobbly cul-de-sac background */}
      <div className={styles.bgScene} aria-hidden="true">
        <div className={styles.sky} />
        <div className={styles.ground} />
        <div className={styles.road} />
        {/* Houses */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.house} style={{ left: `${8 + i * 17}%` }}>
            <div className={styles.houseRoof} />
            <div className={styles.houseBody} />
            <div className={styles.houseDoor} />
            <div className={styles.houseWindow} />
            <div className={styles.houseWindow} style={{ right: 10, left: 'auto' }} />
          </div>
        ))}
        {/* Jawbreaker decorations */}
        {['#E84040','#E8A317','#4A90D9','#4AA15C','#D44DE8'].map((c,i) => (
          <div key={i} className={styles.jawbreaker}
            style={{ left: `${10 + i * 20}%`, top: `${15 + (i%3)*8}%`, background: c, animationDelay: `${i*0.4}s` }} />
        ))}
      </div>

      <main className={styles.main}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.showTitle}>
            <span className={styles.titleEd}>Ed,</span>
            <span className={styles.titleEdd}> Edd</span>
            <span className={styles.titleN}> n'</span>
            <span className={styles.titleEddy}> Eddy</span>
          </div>
          <div className={styles.subtitle}>AI English Companions</div>
          <div className={styles.subtitleSmall}>
            Pick your tutor and start learning English the cul-de-sac way!
          </div>
        </div>

        {/* Character Cards */}
        <div className={styles.cards}>
          {PERSONA_ORDER.map((id) => {
            const p = PERSONA_CONFIG[id];
            const Illustration = ILLUSTRATIONS[id];
            return (
              <button
                key={id}
                className={styles.card}
                style={{
                  '--card-color': p.color,
                  '--card-bg': p.bgColor,
                  '--card-border': p.borderColor,
                  '--card-text': p.textColor,
                }}
                onClick={() => selectPersona(id)}
                disabled={!!loading}
                aria-label={`Chat with ${p.fullName}`}
              >
                <div className={styles.cardHeader} style={{ background: p.color }}>
                  <span className={styles.roleTag}>{p.role}</span>
                </div>
                <div className={styles.cardIllustration}>
                  <Illustration />
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.charName} style={{ color: p.textColor }}>
                    {p.fullName}
                  </h2>
                  <p className={styles.charDesc}>{p.description}</p>
                  <p className={styles.charQuirk}>{p.quirk}</p>
                  <p className={styles.catchphrase} style={{ color: p.color }}>
                    {p.catchphrase}
                  </p>
                  <div className={styles.startBtn} style={{ background: p.color }}>
                    {loading === id ? 'Loading...' : `Talk to ${p.name}! ${p.emoji}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cartoon Network credit */}
        <footer className={styles.footer}>
          <div className={styles.cnLogo}>
            <div className={styles.cnCircle}>
              <span className={styles.cnText}>cn</span>
            </div>
            <span className={styles.cnLabel}>Cartoon Network</span>
          </div>
          <p className={styles.copyright}>
            Ed, Edd n Eddy™ & © Cartoon Network. A Time Warner Company. All Rights Reserved.<br />
            This is a fan-made educational app. Not affiliated with or endorsed by Cartoon Network.
          </p>
        </footer>
      </main>
    </div>
  );
}
