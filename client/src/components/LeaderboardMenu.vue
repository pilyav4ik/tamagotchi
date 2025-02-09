<template>
  <div class="leaderboards">
    <h2>🏆 Leaderboard</h2>
    <div class="leaderboardsList">
        <span>
            <RouterLink to="/weeklyleaderboard" active-class="active-link">
              Weekly
            </RouterLink> 
        </span>
        <span>
            <RouterLink to="/leaderboard" active-class="active-link">
              Global
            </RouterLink> 
        </span>
      </div>
  </div>
</template>


<style>
.leaderboards{
  padding-top: 5vh;
}

.leaderboards h2{
  text-align: center;
  margin-bottom: 24px
}
.leaderboardsList{
  display: flex;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    background-color: #b1978d;
    border-radius: 10vw;
  
}

.leaderboardsList span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  border-radius: 10vw;
  padding: 10px;
  height: 6vh;
}


.leaderboardsList a{
  text-decoration: none;
  color: #e2e2e2;
  font-weight: bold;
  display: block;
}

span:has(a.active-link) {
  background-color: #754634;
}
</style>