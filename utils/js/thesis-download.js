(() => {
    const host = document.getElementById("manuscript-content");
    const entry = document.querySelector(".thesis-feature");
    if (!host && !entry) return;
    const storageName = "manuscript-entry-once-v2";
    const cache = new Map();
    let activeKey;
    const getData = async (path) => {
        if (!cache.has(path)) {
            const response = await fetch(path + "?v=20261208", { cache: "no-store" });
            if (!response.ok) throw new Error("The manuscript could not be loaded. Please try again later.");
            cache.set(path, new Uint8Array(await response.arrayBuffer()));
        }
        return cache.get(path);
    };
    const decrypt = (data, key) => crypto.subtle.decrypt({ name: "AES-GCM", iv: data.slice(24, 36) }, key, data.slice(36));
    const readSavedKey = async () => {
        try {
            const saved = sessionStorage.getItem(storageName);
            sessionStorage.removeItem(storageName);
            return saved ? await crypto.subtle.importKey("jwk", JSON.parse(saved), "AES-GCM", true, ["decrypt"]) : null;
        } catch { return null; }
    };
    const openPage = async (key, content) => {
        activeKey = key;
        if (!host) {
            location.href = entry.href;
            return;
        }
        host.innerHTML = new TextDecoder().decode(content);
        host.hidden = false;
        document.getElementById("manuscript-gate").hidden = true;
        const button = document.getElementById("thesis-download");
        button.addEventListener("click", async () => {
            const status = document.getElementById("download-status");
            button.disabled = true;
            status.textContent = "Preparing your download...";
            try {
                const data = await getData("../src/doc/thesis/thesis.encrypted");
                const pdf = await decrypt(data, activeKey);
                const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = "Zihao_GUO_PhD_Manuscript.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 60000);
                status.textContent = "Your download has started.";
            } catch {
                status.textContent = "Unable to download the manuscript. Please try again.";
            } finally { button.disabled = false; }
        });
    };
    const gate = document.createElement(host ? "div" : "dialog");
    gate.className = "manuscript-access";
    gate.innerHTML = `<form><h2 class="h5 font-weight-600 mb-3">Doctoral research manuscript</h2>
        <p>Enter the password to access the manuscript page.</p>
        <label for="manuscript-password">Password</label>
        <input id="manuscript-password" class="form-control mb-3" type="password" autocomplete="current-password" required>
        <button class="btn btn-primary" type="submit">Enter manuscript page</button>
        ${host ? '<a class="ml-3" href="project.html">Back to My Research</a>' : '<button class="btn ml-3" type="button" id="cancel-access">Cancel</button>'}
        <p class="mt-3 mb-0" role="status" aria-live="polite"></p></form>`;
    if (host) document.getElementById("manuscript-gate").appendChild(gate);
    else {
        document.body.appendChild(gate);
        gate.querySelector("#cancel-access").onclick = () => gate.close();
    }
    gate.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = gate.querySelector('[role="status"]');
        const input = gate.querySelector("input");
        const button = gate.querySelector('[type="submit"]');
        button.disabled = true;
        status.textContent = "Checking access...";
        try {
            if (!globalThis.crypto?.subtle) throw new Error("Please open this page over HTTPS.");
            const data = await getData("../src/doc/thesis/manuscript-page.encrypted");
            const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(input.value.trim()), "PBKDF2", false, ["deriveKey"]);
            const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: data.slice(8, 24), iterations: 600000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, true, ["decrypt"]);
            let content;
            try { content = await decrypt(data, key); }
            catch { cache.clear(); status.textContent = "Incorrect password. Please try again."; input.focus(); input.select(); return; }
            if (!host) {
                try { sessionStorage.setItem(storageName, JSON.stringify(await crypto.subtle.exportKey("jwk", key))); } catch {}
            }
            input.value = "";
            await openPage(key, content);
        } catch (error) { status.textContent = error.message || "Unable to access the manuscript."; }
        finally { button.disabled = false; }
    });
    const trySavedAccess = async () => {
        const key = await readSavedKey();
        if (!key) return false;
        try { await openPage(key, await decrypt(await getData("../src/doc/thesis/manuscript-page.encrypted"), key)); return true; }
        catch { try { sessionStorage.removeItem(storageName); } catch {} return false; }
    };
    if (host) {
        trySavedAccess();
        window.addEventListener("pagehide", () => {
            activeKey = null;
            host.innerHTML = "";
            host.hidden = true;
            document.getElementById("manuscript-gate").hidden = false;
        });
    }
    else entry.addEventListener("click", (event) => {
        event.preventDefault();
        gate.querySelector("input").value = "";
        gate.querySelector('[role="status"]').textContent = "";
        gate.showModal();
        gate.querySelector("input").focus();
    });
})();
