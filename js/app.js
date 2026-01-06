let current;

async function search() {

    const name = document.getElementById("username").value.trim();

    if (!name) {
        document.getElementById("error").textContent = "Please enter username";
        return;
    }

    document.getElementById("error").textContent = "";
    document.getElementById("loading").classList.remove("hidden");

    try {
        const res = await fetch(`https://billowing-glade-0a90.akash-786-2000.workers.dev?player=${name}`);

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        load(data);

    } catch (e) {
        document.getElementById("error").textContent = e.message;
    }

    document.getElementById("loading").classList.add("hidden");
}

function load(data) {

    current = data;

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

    const profile = current.profiles[id];

    const c = profile.data.currencies;

    document.getElementById("economy").innerHTML = `
        <h3>Economy</h3>
        <p>Purse: ${Number(c.coin_purse || 0).toLocaleString()}</p>
        <p>Bank: ${Number(c.bank || 0).toLocaleString()}</p>
    `;

    const nw = profile.data.networth;

    if (nw) {
        document.getElementById("networth").innerHTML = `
            <h3>Networth</h3>
            <p>Total: ${Number(nw.networth).toLocaleString()}</p>
            <p>Unsoulbound: ${Number(nw.unsoulbound_networth).toLocaleString()}</p>
        `;
    }

    let html = `<h3>Skills</h3><div class="grid">`;

    for (const s in profile.data.skills) {
        const sk = profile.data.skills[s];
        html += `<div class="card">${s}<br>Level ${sk.level}</div>`;
    }

    html += "</div>";

    document.getElementById("skills").innerHTML = html;

    const d = profile.data.dungeons;

    document.getElementById("dungeons").innerHTML = `
        <h3>Dungeons</h3>
        Catacombs Level: ${d.catacombs.level}
    `;

    let slayerHtml = `<h3>Slayers</h3><div class="grid">`;

    for (const s in profile.data.slayers) {
        const sl = profile.data.slayers[s];
        slayerHtml += `<div class="card">${s}<br>XP ${Number(sl.xp || 0).toLocaleString()}</div>`;
    }

    slayerHtml += "</div>";

    document.getElementById("slayers").innerHTML = slayerHtml;
}

window.search = search;

const params = new URLSearchParams(location.search);

if (params.get("player")) {
    document.getElementById("username").value = params.get("player");
    search();
}
