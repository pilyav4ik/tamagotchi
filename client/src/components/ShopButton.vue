<template>
    <div class="buy">            
        <RouterLink to="/shop">
            <i
        class="fa fa-shop"
        aria-hidden="true"
      ></i>
      <br>
      <span class="title">
            Shop
        </span>
 
        </RouterLink>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>

<style lang="css" >
.buy{
    position: absolute;
    left: 8px;
    top: 50vh;
    z-index: 10000;
    width: 60px;
    text-align: center;
}
.buy a {
    display: block;
    text-decoration: none;
    color: #2b1c00;
    align-content: center;
    align-items: center;
    padding: 0.3rem;
    position: relative;
    z-index: 100;
}

.buy {
    background: linear-gradient(-45deg, rgba(186, 148, 62, 1) 0%, rgba(236, 172, 32, 1) 20%, rgba(186, 148, 62, 1) 39%, rgba(249, 244, 180, 1) 50%, rgba(186, 148, 62, 1) 60%, rgba(236, 172, 32, 1) 80%, rgba(186, 148, 62, 1) 100%);
    background-clip: background-clip;
    -webkit-text-fill-color: black;
    animation: shine 3s infinite;
    background-size: 350%;
    background-position: left;
    border-radius: 15px;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}
@keyframes shine {
  to{background-position: right}
 
}

.buy div i{
    padding-right: 0.5em;
}

.buy .title{
    font-size: 14px;
    font-weight: normal;
    margin: 0;
}
</style>