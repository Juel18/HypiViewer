export function renderItems(containerId, title, items) {
    if (!items || !items.length) return;

    let html = `<h3>${title}</h3><div class="item-grid">`;

    for (const item of items) {
        if (!item || !item.id) continue;

        const img = `https://mc-heads.net/item/${item.id}`;
        const lore = (item.lore || []).join("\n");

        html += `
        <div class="item">
            <img src="${img}">
            <div class="tooltip">
                <strong>${item.name || item.id}</strong>
                ${lore ? "\n\n" + lore : ""}
            </div>
        </div>`;
    }

    html += `</div>`;
    document.getElementById(containerId).innerHTML = html;
}
