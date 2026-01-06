import { cacheGet, cacheSet } from "./utils.js";
import {
    renderPlayer,
    renderEconomy,
    renderNetworth,
    renderSkills,
    renderDungeons,
    renderSlayers,
    renderInventories
} from "./render.js";

let current;

window.search = async function () {
    const name = document.getElementById("username").value.trim();
    if (!name) return;

    const cached = cacheGet(name);
    if (cached) return load(cached);

    document.getElementById("loading").classList.remove("hidden");

    try {
        const res = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${name}`);
        if (!res.ok) throw new Error("Player not found");
        const data = await res.json();
        cacheSet(name, data);
        load(data);
    } catch (e) {
        document.getElementById("error").textContent = e.message;
    }

    document.getElementById("loading").classList.add("hidden");
};

function load(data) {
    current = data;
    document.getElementById("content").classList.remove("hidden");
    renderPlayer(data);

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
    const p = current.profiles[id];
    renderEconomy(p);
    renderNetworth(p);
    renderSkills(p);
    renderDungeons(p);
    renderSlayers(p);
    renderInventories(p);
}

const q = new URLSearchParams(location.search).get("player");
if (q) {
    document.getElementById("username").value = q;
    search();
}
