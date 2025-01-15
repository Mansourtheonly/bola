const container = document.querySelector(".container");

container.addEventListener("dragover", event => {
    event.preventDefault();
});

container.addEventListener("drop", event => {
    event.preventDefault();
    if (container.querySelectorAll('.player').length >= 6) {
        alert('Maximum of six players allowed on the pitch.');
        return;
    }
    const playerData = JSON.parse(event.dataTransfer.getData("text/plain"));
    const penaltyRight = document.querySelector('.panelty.right');
    const rect = penaltyRight.getBoundingClientRect();
    const dropX = event.clientX;
    const dropY = event.clientY;
    if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
        // Place as goalkeeper in the right penalty area
        placeGoalkeeper(playerData, penaltyRight);
    } else {
        // Place as field player
        placeFieldPlayer(event, playerData);
    }
    document.getElementById(playerData.id).style.display = 'none';
});
function placeGoalkeeper(player, penaltyArea) {
    // Remove any existing goalkeeper
    const existingGoalkeeper = container.querySelector('.goalkeeper');
    if (existingGoalkeeper) {
        existingGoalkeeper.remove();
    }
    // Create and place the new goalkeeper
    const goalkeeper = document.createElement('div');
    goalkeeper.className = 'player goalkeeper';
    goalkeeper.textContent = player.name;
    // Position the goalkeeper at the center of the penalty area
    const penaltyRect = penaltyArea.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const left = penaltyRect.left - containerRect.left + (penaltyRect.width / 2 - goalkeeper.offsetWidth / 2);
    const top = penaltyRect.top - containerRect.top + (penaltyRect.height / 2 - goalkeeper.offsetHeight / 2);
    goalkeeper.style.left = left + 'px';
    goalkeeper.style.top = top + 'px';
    container.appendChild(goalkeeper);
    // Prevent goalkeeper from being draggable
    goalkeeper.draggable = false;
    // Add remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-player';
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', () => {
        goalkeeper.remove();
        const playerItem = document.getElementById(player.id);
        playerItem.style.display = 'block';
    });
    goalkeeper.appendChild(removeBtn);
}
function placeFieldPlayer(event, playerData) {
    const playerElement = document.createElement("div");
    playerElement.className = "player field-player";
    playerElement.textContent = playerData.name;
    playerElement.dataset.playerId = playerData.id;
    playerElement.style.left = `${event.clientX - container.getBoundingClientRect().left}px`;
    playerElement.style.top = `${event.clientY - container.getBoundingClientRect().top}px`;
    container.appendChild(playerElement);
    // Make field players draggable within the pitch
    playerElement.draggable = true;
    playerElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(playerData));
    });
    // Add remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-player';
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', () => {
        playerElement.remove();
        const playerItem = document.getElementById(playerData.id);
        playerItem.style.display = 'block';
    });
    playerElement.appendChild(removeBtn);
}

fetch('players.json')
    .then(response => response.json())
    .then(players => {
        players.forEach(player => {
            createPlayerElement(player);
        });
    });

function createPlayerElement(player) {
    const playerItem = document.createElement('div');
    playerItem.id = player.id;
    playerItem.className = 'player-draggable';
    playerItem.draggable = true;
    playerItem.textContent = player.name;
    playerItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(player));
    });
    document.body.appendChild(playerItem);
}
function constrainPosition(event) {
    const containerRect = container.getBoundingClientRect();
    const player = event.target;
    if (player.classList.contains('field-player')) {
        let left = event.clientX - containerRect.left;
        let top = event.clientY - containerRect.top;
        // Constrain within pitch boundaries
        left = Math.max(0, Math.min(containerRect.width - player.offsetWidth, left));
        top = Math.max(0, Math.min(containerRect.height - player.offsetHeight, top));
        player.style.left = left + 'px';
        player.style.top = top + 'px';
    }
}

container.addEventListener('drag', event => {
    if (event.target.classList.contains('field-player')) {
        constrainPosition(event);
    }
});