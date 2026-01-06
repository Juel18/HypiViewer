let currentData;

async function search() {
    const name = document.getElementById("username").value.trim();

    if (!name) {
        document.getElementById("error").textContent = "Please enter username";
        return;
    }

    document.getElementById("error").textContent = "";
    document.getElementById("loading").classList.remove("hidden");

    try {
        const res = await fetch(`https://billowing-glade-0a90.akash-786-2000.workers.dev/?player=${name}`);

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        load(data);

    } catch (e) {
        document.getElementById("error").textContent = e.message;
    }

    document.getElementById("loading").classList.add("hidden");
}

function load(data) {
    currentData = data;

    document.getElementById("content").classList.remove("hidden");

    document.getElementById("player-info").innerHTML = `
        <h2>${data.username}</h2>
        <p>UUID: ${data.uuid}</p>
    `;

    const select = document.getElementById("profileSelect");
    select.innerHTML = "";

    for (const id in data.profiles) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = data.profiles[id].cute_name;
        select.appendChild(opt);
    }

    select.onchange = () => renderProfile(select.value);
    renderProfile(select.value);
}

function renderProfile(id) {
    const profile = currentData.profiles[id];

    const c = profile.data.currencies;

    document.getElementById("economy").innerHTML = `
        <h3>Economy</h3>
        <p>Purse: ${Number(c.coin_purse).toLocaleString()}</p>
        <p>Bank: ${Number(c.bank).toLocaleString()}</p>
    `;

    const nw = profile.data.networth;
    if (nw) {
        document.getElementById("networth").innerHTML = `
            <h3>Networth</h3>
            <p>Total: ${Number(nw.networth).toLocaleString()}</p>
            <p>Unsoulbound: ${Number(nw.unsoulbound_networth).toLocaleString()}</p>
        `;
    }

    let skillHtml = `<h3>Skills</h3><div class="grid">`;

    for (const s in profile.data.skills) {
        const sk = profile.data.skills[s];
        skillHtml += `
            <div class="card">
                ${s}<br>
                Level ${sk.level}
            </div>
        `;
    }

    skillHtml += "</div>";

    document.getElementById("skills").innerHTML = skillHtml;

    const d = profile.data.dungeons;
    document.getElementById("dungeons").innerHTML = `
        <h3>Dungeons</h3>
        Catacombs Level: ${d.catacombs.level}
    `;

    let slayerHtml = `<h3>Slayers</h3><div class="grid">`;

    for (const s in profile.data.slayers) {
        const sl = profile.data.slayers[s];
        slayerHtml += `
            <div class="card">
                ${s}<br>
                XP ${Number(sl.xp).toLocaleString()}
            </div>
        `;
    }

    slayerHtml += "</div>";

    document.getElementById("slayers").innerHTML = slayerHtml;

    renderItems("inventory", "Inventory", profile.data.inventory);
    renderItems("armor", "Armor", profile.data.armor);
    renderItems("enderchest", "Ender Chest", profile.data.ender_chest);
}

function renderItems(containerId, title, items) {
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

window.search = search;

const params = new URLSearchParams(location.search);
if (params.get("player")) {
    document.getElementById("username").value = params.get("player");
    search();
}

