import {makeScene2D, Rect, Txt, Line, Circle, Node, Layout} from '@motion-canvas/2d';
import {
  createRef, createSignal, all, sequence, chain, waitFor,
  easeOutCubic, easeInOutCubic, easeOutBack, linear, Vector2,
} from '@motion-canvas/core';

const TEAL = '#00C8D7';
const WHITE = '#EFF2F7';
const DIM = 'rgba(239,242,247,0.55)';
const CARD = '#0A0F1A';
const BORDER = 'rgba(255,255,255,0.08)';
const SERIF = 'Syne, Georgia, serif';
const SANS = 'DM Sans, Arial, sans-serif';

export default makeScene2D(function* (view) {
  view.fill('#05080E');

  /* ===================================================================
     SECTION 1 · TITLE
  =================================================================== */
  const eyebrow = createRef<Txt>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const rule = createRef<Rect>();

  view.add(
    <Node>
      <Txt ref={eyebrow} text="dentsu · MEIJER RETAIL MEDIA NETWORK" fontFamily={SANS}
        fontSize={26} letterSpacing={6} fill={TEAL} y={-180} opacity={0} />
      <Txt ref={title} text="Bharat Vamsi" fontFamily={SERIF} fontWeight={800}
        fontSize={150} fill={WHITE} y={-40} opacity={0} />
      <Rect ref={rule} width={0} height={4} fill={TEAL} y={70} />
      <Txt ref={subtitle} fontFamily={SANS} fontSize={34} fill={DIM} y={150}
        text="The operating engine behind a $275M retail media network" opacity={0} />
    </Node>,
  );

  yield* sequence(
    0.25,
    eyebrow().opacity(1, 0.6),
    all(title().opacity(1, 0.7), title().y(-30, 0.7, easeOutCubic)),
    rule().width(420, 0.6, easeOutCubic),
    subtitle().opacity(1, 0.6),
  );
  yield* waitFor(1.3);
  yield* all(
    eyebrow().opacity(0, 0.5),
    title().opacity(0, 0.5),
    subtitle().opacity(0, 0.5),
    rule().width(0, 0.5),
  );

  /* ===================================================================
     SECTION 2 · DATA SUPPLY CHAIN  (Meijer 1P data → 5 platforms → ROAS)
  =================================================================== */
  const flowTitle = createRef<Txt>();
  const source = createRef<Rect>();
  const sink = createRef<Rect>();
  view.add(
    <Txt ref={flowTitle} text="ONE OPERATING ENGINE · FIVE PROGRAMMATIC PLATFORMS" fontFamily={SANS}
      fontSize={24} letterSpacing={4} fill={TEAL} y={-380} opacity={0} />,
  );
  yield* flowTitle().opacity(1, 0.5);

  // Source node (left)
  view.add(
    <Rect ref={source} x={-720} y={0} width={300} height={150} radius={10}
      fill={CARD} stroke={TEAL} lineWidth={2} opacity={0} layout
      direction="column" alignItems="center" justifyContent="center" gap={8} padding={20}>
      <Txt text="MEIJER" fontFamily={SERIF} fontWeight={800} fontSize={40} fill={WHITE} />
      <Txt text="1st-party retail data" fontFamily={SANS} fontSize={22} fill={DIM} />
    </Rect>,
  );

  // Sink node (right)
  view.add(
    <Rect ref={sink} x={720} y={0} width={300} height={150} radius={10}
      fill="rgba(0,200,215,0.08)" stroke={TEAL} lineWidth={2.5} opacity={0} layout
      direction="column" alignItems="center" justifyContent="center" gap={8} padding={20}>
      <Txt text="ADVERTISER" fontFamily={SERIF} fontWeight={800} fontSize={34} fill={TEAL} />
      <Txt text="ROAS · closed loop" fontFamily={SANS} fontSize={22} fill={WHITE} />
    </Rect>,
  );

  yield* all(
    source().opacity(1, 0.5), source().x(-680, 0.5, easeOutCubic),
    sink().opacity(1, 0.5), sink().x(680, 0.5, easeOutCubic),
  );

  // 5 platform nodes in the middle column
  const platforms = ['DV360', 'The Trade Desk', 'GAM', 'Meta', 'Pinterest'];
  const pRefs = platforms.map(() => createRef<Rect>());
  const inRefs = platforms.map(() => createRef<Line>());
  const outRefs = platforms.map(() => createRef<Line>());
  const ys = [-260, -130, 0, 130, 260];

  platforms.forEach((name, i) => {
    view.add(
      <Line ref={inRefs[i]} stroke={TEAL} lineWidth={2.5} end={0} opacity={0.7}
        points={[[-530, 0], [-110, ys[i]]]} lineDash={[8, 6]} />,
    );
    view.add(
      <Line ref={outRefs[i]} stroke={TEAL} lineWidth={2.5} end={0} opacity={0.7}
        points={[[110, ys[i]], [530, 0]]} lineDash={[8, 6]} />,
    );
    view.add(
      <Rect ref={pRefs[i]} x={0} y={ys[i]} width={210} height={74} radius={8}
        fill={CARD} stroke={BORDER} lineWidth={1.5} opacity={0} scale={0.7} layout
        alignItems="center" justifyContent="center" padding={10}>
        <Txt text={name} fontFamily={SANS} fontWeight={500} fontSize={26} fill={WHITE} />
      </Rect>,
    );
  });

  // Stagger platform reveal + draw inbound lines
  yield* sequence(
    0.12,
    ...pRefs.map((p, i) => all(
      p().opacity(1, 0.35),
      p().scale(1, 0.4, easeOutBack),
      inRefs[i]().end(1, 0.5, easeOutCubic),
    )),
  );
  // Draw outbound lines to the advertiser
  yield* sequence(0.1, ...outRefs.map(o => o().end(1, 0.45, easeOutCubic)));

  // Pulse the whole chain once (data flowing)
  yield* sequence(
    0.06,
    ...pRefs.map(p => chain(
      p().stroke(TEAL, 0.2),
      p().stroke(BORDER, 0.4),
    )),
  );
  yield* waitFor(0.8);

  // Clear section 2
  yield* all(
    flowTitle().opacity(0, 0.5),
    source().opacity(0, 0.5),
    sink().opacity(0, 0.5),
    ...pRefs.map(p => p().opacity(0, 0.5)),
    ...inRefs.map(l => l().opacity(0, 0.4)),
    ...outRefs.map(l => l().opacity(0, 0.4)),
  );

  /* ===================================================================
     SECTION 3 · METRICS COUNT-UP
  =================================================================== */
  const mTitle = createRef<Txt>();
  view.add(
    <Txt ref={mTitle} text="VERIFIED IN THE MEIJER CLIENT QBR · 2025 YoY" fontFamily={SANS}
      fontSize={24} letterSpacing={4} fill={TEAL} y={-330} opacity={0} />,
  );
  yield* mTitle().opacity(1, 0.5);

  // signals for count-up
  const budget = createSignal(0);
  const roas = createSignal(0);
  const cvr = createSignal(0);
  const dif = createSignal(0);
  const camps = createSignal(0);

  const metricDefs = [
    {x: -760, val: () => `$${budget().toFixed(0)}M`, label: 'Media managed'},
    {x: -380, val: () => `+${roas().toFixed(0)}%`, label: 'ROAS · YoY'},
    {x: 0, val: () => `+${cvr().toFixed(0)}%`, label: 'CVR · YoY'},
    {x: 380, val: () => `>${dif().toFixed(0)}%`, label: 'Delivery in Full'},
    {x: 760, val: () => `${camps().toFixed(0)}`, label: 'Campaigns'},
  ];
  const mCards = metricDefs.map(() => createRef<Rect>());
  metricDefs.forEach((m, i) => {
    view.add(
      <Rect ref={mCards[i]} x={m.x} width={350} height={260} radius={10}
        fill={CARD} stroke={BORDER} lineWidth={1.5} opacity={0} y={60} layout
        direction="column" alignItems="center" justifyContent="center" gap={16} padding={20}>
        <Txt text={m.val} fontFamily={SERIF} fontWeight={800} fontSize={72} fill={TEAL} />
        <Txt text={m.label} fontFamily={SANS} fontSize={24} fill={DIM} />
      </Rect>,
    );
  });

  yield* sequence(0.1, ...mCards.map(c => all(
    c().opacity(1, 0.4),
    c().y(20, 0.45, easeOutCubic),
  )));
  yield* all(
    budget(275, 1.6, easeInOutCubic),
    roas(134, 1.6, easeInOutCubic),
    cvr(107, 1.6, easeInOutCubic),
    dif(98, 1.6, easeInOutCubic),
    camps(968, 1.8, easeInOutCubic),
  );
  yield* waitFor(1.0);
  yield* all(mTitle().opacity(0, 0.5), ...mCards.map(c => c().opacity(0, 0.5)));

  /* ===================================================================
     SECTION 4 · GROWTH  $75M → $275M
  =================================================================== */
  const gTitle = createRef<Txt>();
  const barOld = createRef<Rect>();
  const barNew = createRef<Rect>();
  const labOld = createRef<Txt>();
  const labNew = createRef<Txt>();
  const grew = createSignal(0);

  view.add(
    <Node>
      <Txt ref={gTitle} text="ACCOUNT RETAINED — AND SCALED 3.7× WITHOUT ADDED HEADCOUNT"
        fontFamily={SANS} fontSize={24} letterSpacing={3} fill={TEAL} y={-330} opacity={0} />
      <Rect ref={barOld} x={-280} y={180} width={220} height={0} fill="rgba(239,242,247,0.18)"
        radius={[6,6,0,0]} offsetY={1} />
      <Rect ref={barNew} x={280} y={180} width={220} height={0} fill={TEAL}
        radius={[6,6,0,0]} offsetY={1} />
      <Txt ref={labOld} text="$75M · 2023" fontFamily={SANS} fontSize={28} fill={DIM} x={-280} y={230} opacity={0} />
      <Txt ref={labNew} fontFamily={SERIF} fontWeight={800} fontSize={40} fill={TEAL} x={280} y={230} opacity={0}
        text={() => `$${grew().toFixed(0)}M · 2026`} />
    </Node>,
  );
  yield* gTitle().opacity(1, 0.5);
  yield* all(
    barOld().height(110, 0.7, easeOutCubic),
    labOld().opacity(1, 0.6),
  );
  yield* all(
    barNew().height(400, 1.2, easeOutCubic),
    labNew().opacity(1, 0.6),
    grew(275, 1.2, easeInOutCubic),
  );
  yield* waitFor(0.9);
  yield* all(
    gTitle().opacity(0, 0.5), barOld().opacity(0, 0.5), barNew().opacity(0, 0.5),
    labOld().opacity(0, 0.5), labNew().opacity(0, 0.5),
  );

  /* ===================================================================
     SECTION 5 · OUTRO  AM → Senior Manager
  =================================================================== */
  const fromT = createRef<Txt>();
  const arrow = createRef<Line>();
  const toT = createRef<Txt>();
  const tag = createRef<Txt>();
  view.add(
    <Node>
      <Txt ref={fromT} text="Account Manager" fontFamily={SERIF} fontWeight={700}
        fontSize={70} fill={DIM} x={-420} opacity={0} />
      <Line ref={arrow} points={[[-110, 0], [110, 0]]} stroke={TEAL} lineWidth={5}
        endArrow arrowSize={22} end={0} />
      <Txt ref={toT} text="Senior Manager" fontFamily={SERIF} fontWeight={800}
        fontSize={78} fill={WHITE} x={430} opacity={0} />
      <Txt ref={tag} text="Continuity insurance on $275M of defensible client revenue."
        fontFamily={SANS} fontSize={30} fill={TEAL} y={150} opacity={0} />
    </Node>,
  );
  yield* sequence(
    0.3,
    fromT().opacity(1, 0.6),
    arrow().end(1, 0.5, easeOutCubic),
    all(toT().opacity(1, 0.6), toT().scale(1.04, 0.6, easeOutBack)),
  );
  yield* tag().opacity(1, 0.7);
  yield* waitFor(1.8);
  yield* all(
    fromT().opacity(0, 0.6), toT().opacity(0, 0.6), arrow().opacity(0, 0.6), tag().opacity(0, 0.6),
  );
});
