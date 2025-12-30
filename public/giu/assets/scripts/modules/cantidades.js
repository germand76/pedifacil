export function generarOpcionesCantidadHTML(max = 7) {
    let html = '';

    for (let i = 0.5; i <= max; i += 0.5) {
        let label;

        if (i === 0.5) label = '1/2';
        else if (Number.isInteger(i)) label = i;
        else label = `${Math.floor(i)} y 1/2`;

        html += `<option value="${i}">${label}</option>`;
    }

    return html;
}
  