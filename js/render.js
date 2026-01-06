import { format } from "./utils.js";
import { renderItems } from "./items.js";

export function renderPlayer(data) {
    document.getElementById("player-info").innerHTML = `
        <h2>${data.username}</h2>
        <p>UUID: ${data.uuid}</p>
    `;
}

export function renderEconomy(profile) {
    const c = profile.data.currencies;
    document.getElementById("economy").innerHTML = `
        <h3>Economy</h3>
        <p>Purse: ${format(c.coin_purse)}</p>
        <p>Bank: ${format(c.bank)}</p>
    `;
}

export function renderNetworth(profile) {
    const n = profile.data.networth;
    if (!n) return;
    document.getElementById("networth").innerHTML = `
        <h3>Networth</h3>
        <p>Total: ${format(n.networth)}</p>
        <p>Unsoulbound: ${format(n.unsoulbound_networth)}</p>
    `;
}

export function renderSkills(profile) {
    let html = `<h3>Skills</h3><div class="grid">`;
    for (const s in profile.data.skills) {
        html += `<div class="card">${s}<br>Level ${profile.data.skills[s].level}</div>`;
    }
    html += `</div>`;
    document.getElementById("skills").innerHTML = html;
}

export function renderDungeons(profile) {
    document.getElementById("dungeons").innerHTML = `
        <h3>Dungeons</h3>
        Catacombs Level: ${profile.data.dungeons.catacombs.level}
    `;
}

export function renderSlayers(profile) {
    let html = `<h3>Slayers</h3><div class="grid">`;
    for (const s in profile.data.slayers) {
        html += `<div class="card">${s}<br>XP ${format(profile.data.slayers[s].xp)}</div>`;
    }
    html += `</div>`;
    document.getElementById("slayers").innerHTML = html;
}

export function renderInventories(profile) {
    renderItems("inventory", "Inventory", profile.data.inventory);
    renderItems("armor", "Armor", profile.data.armor);
    renderItems("enderchest", "Ender Chest", profile.data.ender_chest);
}
