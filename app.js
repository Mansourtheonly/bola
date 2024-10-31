document.addEventListener("DOMContentLoaded", () => {
    const playerList = document.getElementById("players");
    const positions = document.querySelectorAll(".position");

    // Fetch player data from JSON file
    fetch("players.json")
        .then(response => response.json())
        .then(players => {
            players.forEach(player => {
                const listItem = document.createElement("li");
                listItem.textContent = player.name;
                listItem.draggable = true;
                listItem.dataset.playerId = player.id;
                
                listItem.addEventListener("dragstart", event => {
                    event.dataTransfer.setData("text/plain", JSON.stringify(player));
                });

                playerList.appendChild(listItem);
            });
        });

    // Enable drop and allow re-dragging on each position
    positions.forEach(position => {
        position.addEventListener("dragover", event => event.preventDefault());

        position.addEventListener("drop", event => {
            event.preventDefault();
            const playerData = JSON.parse(event.dataTransfer.getData("text/plain"));
            const playerName = playerData.name;

            // Set dropped player's name and make draggable
            position.textContent = playerName;
            position.dataset.playerId = playerData.id;

            // Make player draggable within the field
            position.draggable = true;
            position.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", JSON.stringify(playerData));
                position.textContent = "Empty";  // Clear slot when dragging
            });
        });
    });
});
