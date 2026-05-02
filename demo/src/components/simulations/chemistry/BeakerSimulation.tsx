'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BeakerSimulationProps {
  ph: number;
  color: string;
}

export function BeakerSimulation({ ph, color }: BeakerSimulationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = 300;
    const H = 320;

    // Beaker bounding box — leave room for pH scale on left
    const beakerX = 60;
    const beakerY = 20;
    const beakerW = W - 80;
    const beakerH = H - 50;
    const rx = 6;

    // Clip path so liquid never leaks outside the beaker
    const defs = svg.append('defs');
    defs.append('clipPath')
      .attr('id', 'beaker-clip')
      .append('rect')
      .attr('x', beakerX + 2)
      .attr('y', beakerY + 2)
      .attr('width', beakerW - 4)
      .attr('height', beakerH - 4)
      .attr('rx', rx - 1);

    // Liquid fill height scales with pH (pH 1-14 → fill 10-90%)
    const fillRatio = 0.1 + 0.8 * ((ph - 1) / 13);
    const liquidH = beakerH * fillRatio;
    const liquidY = beakerY + beakerH - liquidH;

    // Beaker outline (drawn last so it sits on top of liquid)
    // Liquid fill — clipped inside beaker
    svg.append('rect')
      .attr('x', beakerX)
      .attr('y', liquidY)
      .attr('width', beakerW)
      .attr('height', liquidH + beakerH)
      .attr('fill', color)
      .attr('opacity', 0.85)
      .attr('clip-path', 'url(#beaker-clip)')
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('y', liquidY);

    // Beaker outline (on top)
    svg.append('rect')
      .attr('x', beakerX)
      .attr('y', beakerY)
      .attr('width', beakerW)
      .attr('height', beakerH)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(200,144,42,0.7)')
      .attr('stroke-width', 2.5)
      .attr('rx', rx);

    // pH meter scale (left side)
    const scaleX = beakerX - 18;
    const scaleTop = beakerY + 8;
    const scaleH = beakerH - 16;

    svg.append('line')
      .attr('x1', scaleX).attr('y1', scaleTop)
      .attr('x2', scaleX).attr('y2', scaleTop + scaleH)
      .attr('stroke', 'rgba(200,144,42,0.4)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round');

    // pH scale labels (1, 7, 14)
    [1, 7, 14].forEach((val) => {
      const labelY = scaleTop + scaleH * ((val - 1) / 13);
      svg.append('text')
        .attr('x', scaleX - 8)
        .attr('y', labelY + 4)
        .attr('text-anchor', 'end')
        .attr('fill', 'rgba(200,144,42,0.4)')
        .attr('font-size', '9')
        .attr('font-family', 'monospace')
        .text(val);
    });
    const cursorY = scaleTop + scaleH * ((ph - 1) / 13);

    svg.append('circle')
      .attr('cx', scaleX)
      .attr('cy', cursorY)
      .attr('r', 0)
      .attr('fill', 'var(--amber, #C8902A)')
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('r', 4);

    // Beaker rim
    svg.append('ellipse')
      .attr('cx', beakerX + beakerW / 2)
      .attr('cy', beakerY)
      .attr('rx', beakerW / 2)
      .attr('ry', 6)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(200,144,42,0.5)')
      .attr('stroke-width', 2);

  }, [ph, color]);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg ref={svgRef} style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }} viewBox="0 0 300 320" preserveAspectRatio="xMidYMid meet" />

      {/* HUD overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">pH VALUE</span>
          <span className="font-mono text-xl text-[var(--accent)] font-bold">{ph.toFixed(1)}</span>
        </div>
      </div>

      {/* Colour indicator chip */}
      <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border border-[var(--border)]"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-xs text-[var(--text-muted)]">{color}</span>
      </div>
    </div>
  );
}
