document.addEventListener("DOMContentLoaded", () => {
    const playerList = document.getElementById("players");
    const positions = document.querySelectorAll(".position");

    fetch("players.json")
        .then(response => response.json())
        .then(players => {
            players.forEach(player => {
                // Create a list item to display the player's name and phone number
                const listItem = document.createElement("li");
                listItem.innerHTML = `<span class="player-number">${player.phone}</span> ${player.name}`;
                listItem.draggable = true;
                listItem.dataset.playerId = player.id;

                listItem.addEventListener("dragstart", event => {
                    event.dataTransfer.setData("text/plain", JSON.stringify({
                        id: player.id,
                        name: player.name,
                        phone: player.phone
                    }));
                });

                playerList.appendChild(listItem);
            });
        });

    positions.forEach(position => {
        position.addEventListener("dragover", event => event.preventDefault());

        position.addEventListener("drop", event => {
            event.preventDefault();
            const playerData = JSON.parse(event.dataTransfer.getData("text/plain"));
            
            // Display only the player's name in the field position
            position.innerHTML = `${playerData.name}`;
            position.dataset.playerId = playerData.id;

            position.draggable = true;
            position.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", JSON.stringify(playerData));
                position.innerHTML = "";  // Clear position on re-dragging
            });
        });
    });
});
