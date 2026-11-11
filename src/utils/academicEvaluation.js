// --- HELPER: ACADEMIC EVALUATION (EN LA FACULTAD LAS NOTAS NO SE PROMEDIAN) ---
// University Rule: In college, you cannot average a 4 and a 7 to promote.
// To promote, you must achieve >= promoMin (usually 7) in EACH exam independently.
// A grade between passMin (4) and 6 only grants regularidad (mandatory final exam).

export function getSubjectAcademicEvaluation(sub, settings = {}) {
  const promoMin = Number(settings.promoMin) || 7;
  const passMin = Number(settings.passMin) || 4;

  const effectiveP1 = (sub.recup1 !== null && sub.recup1 !== undefined && sub.recup1 !== '')
    ? Number(sub.recup1)
    : ((sub.p1 !== null && sub.p1 !== undefined && sub.p1 !== '') ? Number(sub.p1) : null);

  const effectiveP2 = (sub.recup2 !== null && sub.recup2 !== undefined && sub.recup2 !== '')
    ? Number(sub.recup2)
    : ((sub.p2 !== null && sub.p2 !== undefined && sub.p2 !== '') ? Number(sub.p2) : null);

  const tpGrade = (sub.tp !== null && sub.tp !== undefined && sub.tp !== '') ? Number(sub.tp) : null;
  const tpApproved = tpGrade === null || tpGrade >= passMin;

  // Case 1: No exams taken yet
  if (effectiveP1 === null && effectiveP2 === null) {
    return {
      statusKey: 'cursando',
      title: 'En Cursada ⏳',
      badgeClass: 'neutral',
      pillText: '⏳ Cursando',
      summary: 'Parciales pendientes de rendir',
      explanation: `Régimen universitario: Para promocionar directo sin final necesitás sacar ≥ ${promoMin} en ambos parciales por separado. Para regularizar (ir a final), al menos ≥ ${passMin} en cada uno.`
    };
  }

  // Case 2: Only 1st Partial taken
  if (effectiveP1 !== null && effectiveP2 === null) {
    if (effectiveP1 >= promoMin) {
      return {
        statusKey: 'on_track_promo',
        title: 'Perfil de Promoción 🚀',
        badgeClass: 'mint',
        pillText: '🚀 Promo en carrera',
        summary: `1°P: ${effectiveP1} (Promocionable)`,
        explanation: `Aprobaste el 1° Parcial con ${effectiveP1}. En la facultad no se promedia: si en el 2° Parcial alcanzás ≥ ${promoMin}, ¡promocionás directo sin rendir final!`
      };
    } else if (effectiveP1 >= passMin) {
      return {
        statusKey: 'regular_path',
        title: 'Camino a Regularizar 📚',
        badgeClass: 'warning',
        pillText: '📚 Aprobó 1°P',
        summary: `1°P: ${effectiveP1} (Aprobado)`,
        explanation: `Aprobaste el 1° Parcial con ${effectiveP1}. Con sacar ≥ ${passMin} en el 2° Parcial asegurás la regularidad para rendir examen final. Recordá que 4 + 7 o 4 + 10 no promedian para promocionar.`
      };
    } else {
      return {
        statusKey: 'must_recup_1',
        title: 'Debe Recuperar 1° Parcial ⚠️',
        badgeClass: 'danger',
        pillText: '⚠️ Recupera 1°',
        summary: `1°P: ${effectiveP1} (Desaprobado)`,
        explanation: `El 1° Parcial no alcanzó el mínimo de ${passMin}. En la facultad no promedia con el 2°: debés rendir y aprobar el Recuperatorio del 1° Parcial para no quedar libre.`
      };
    }
  }

  // Case 3: Both partials recorded
  const p1Promo = effectiveP1 >= promoMin;
  const p2Promo = effectiveP2 >= promoMin;
  const p1Pass = effectiveP1 >= passMin;
  const p2Pass = effectiveP2 >= passMin;

  if (p1Promo && p2Promo && tpApproved) {
    return {
      statusKey: 'promocionada',
      title: '¡Promocionada! 🎉',
      badgeClass: 'success',
      pillText: '🎉 Promocionada',
      summary: `1°P: ${effectiveP1} • 2°P: ${effectiveP2} (Promoción Directa)`,
      explanation: `¡Felicitaciones! Cumpliste la exigencia en ambos parciales por separado (≥ ${promoMin}) y TP. Materia cerrada con promoción directa sin final.`
    };
  }

  if (p1Pass && p2Pass && tpApproved) {
    return {
      statusKey: 'regular',
      title: 'Regular (A Examen Final) 📚',
      badgeClass: 'warning',
      pillText: '📚 Regular (Final)',
      summary: `1°P: ${effectiveP1} • 2°P: ${effectiveP2} (Cursada Acreditada)`,
      explanation: `Aprobaste cada parcial (≥ ${passMin}). En la facultad las notas no promedian para promoción: un 4 + 7 no te hace promocionar porque se debe sacar más de 7 en cada examen. Cursada regularizada lista para mesa de final.`
    };
  }

  if (!p1Pass && !p2Pass) {
    return {
      statusKey: 'libre',
      title: 'Recursar / Libre ❌',
      badgeClass: 'danger',
      pillText: '❌ Libre / Recursar',
      summary: `1°P: ${effectiveP1} • 2°P: ${effectiveP2} (Ambos < ${passMin})`,
      explanation: `Ambos parciales están desaprobados. Las notas no promedian y se pierde la regularidad según el reglamento universitario.`
    };
  }

  if (!p1Pass) {
    return {
      statusKey: 'must_recup_1',
      title: 'A Recuperatorio 1° Parcial 🔄',
      badgeClass: 'danger',
      pillText: '🔄 Recupera 1°',
      summary: `1°P: ${effectiveP1} (Desaprobado) • 2°P: ${effectiveP2} (Aprobado)`,
      explanation: `Aunque aprobaste el 2° Parcial, las notas no se promedian. Debés rendir el Recuperatorio del 1° Parcial para regularizar la materia.`
    };
  }

  if (!p2Pass) {
    return {
      statusKey: 'must_recup_2',
      title: 'A Recuperatorio 2° Parcial 🔄',
      badgeClass: 'danger',
      pillText: '🔄 Recupera 2°',
      summary: `1°P: ${effectiveP1} (Aprobado) • 2°P: ${effectiveP2} (Desaprobado)`,
      explanation: `Aunque aprobaste el 1° Parcial, las notas no se promedian. Debés rendir el Recuperatorio del 2° Parcial para no perder la cursada.`
    };
  }

  return {
    statusKey: 'cursando',
    title: 'En Cursada ⏳',
    badgeClass: 'neutral',
    pillText: '⏳ Cursando',
    summary: 'Evaluaciones en proceso',
    explanation: 'Cursada activa.'
  };
}

