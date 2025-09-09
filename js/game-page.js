function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";
}

// Optional: Hook side menu inputs to your existing search/sort logic
document.getElementById("sideSearch").addEventListener("input", function(e) {
    document.getElementById("search").value = e.target.value;
    document.getElementById("search").dispatchEvent(new Event("input"));
});

document.getElementById("sideSortOptions").addEventListener("change", function(e) {
    document.getElementById("sortOptions").value = e.target.value;
    document.getElementById("sortOptions").dispatchEvent(new Event("change"));
});
