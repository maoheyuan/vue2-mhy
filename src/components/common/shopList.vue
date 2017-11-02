<template>

  <div class="shoplist_container">
    <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
      <router-link :to="{path:'shop',query:{geohash,id:item.id}}"
       v-for="item in shopListArr" tag="li" :key="item.id" class="shop_li">

        <section>
          <img :src="item.image_path" class="shop_img">
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 :class="item.is_premium? 'premium':''" class="shop_title ellipsis">{{item.name}}</h4>
            <ul class="shop_detail_ul">
              <li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
                <rating-start :rating="item.rating"></rating-start>
                <span class="rating_num">{{item.rating}}</span>
              </section>
              <section class="order_section">
                月售{{item.recent_order_num}}单
              </section>

            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
              <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ¥{{item.float_minimum_order_amount}}起送
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">{{item.distance>1000?(item.distance/1000).toFixed(2)+"km":item.distance+"m"}}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{item.order_lead_time}}</span>

            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>

    <ul v-else class="animation_opactiy">
      <li class="list_back_li" v-for="item in 10" :key="item">
        <img src="../../images/shopback.svg" class="list_back_svg">
      </li>
    </ul>
    <p v-if="touchend" class="empty_data">没有更多了</p>
    <aside class="return_top" @click="backTop" v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>
    <div ref="bac" style="background-color: red;"></div>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>

  </div>
</template>
<script>
  import {mapState} from "vuex"
  import {shopList} from "../../service/getData"
  import {imagBaseUrl} from "../../config/env"
  import {showBack,animate} from "../../config/mUtils"
  import {loadMore,getImgPath} from "./mixin"
  import loading from "./loading"
  import ratingStar from "./ratingStar"

  export default {
    data(){

      return {
        offset:0,
        shopListArr:[],
        preventRepeatReuqest:false,
        showBackStatus:false,
        showLoading:true,
        touchend:false,
        imgBaseurl:'',
      }
    },
    mounted(){
      this.initData();
    },
    components:{
      loading,
      ratingStar,
    },
    props:[
      "restaurantCategoryId",
      "restaurantCategoryIds",
      "sortByType",
      "deliveryMode",
      "supportIds",
      "confirmSelect",
      "geohash"
    ],
    mixins:[loadMore,getImgPath],
    computed:{
      ...mapState([
        'latitude',
        'longitude'
      ])
    },
    update(){

    },
    methods:{
       async initData(){
         let res=await shopList(this.latitude,this.longitude,this.offset,this.restaurantCategoryId);
         this.shopListArr=[...res];
         if(res.length<=20){
           this.touchend=true
         }
         this.hideLoading();
         showBack(status=>{
           this.showBackStatus=status;
         });
       },
      async loaderMore(){
        if(this.touchend){
          return;
        }
        if(this.preventRepeatReuqest){
          return ;
        }
        this.showLoading=true;
        this.preventRequestRequest=true;
        this.offset+=20;
        let res=await shopList(this.latitude,this.longitude,this.offset,this.restaurantCategoryId);
        this.hideLoading();
        this.shopListArr=[...this.showListArr,...res];
        if(res.length<20){
          this.touchend=true;
          return
        }

        this.preventRequestRequest=false;
      },
      backTop(){

        animate(document.body,{scrollTop:'0'},400,"ease-out");
      },
      async listenPropChange(){
        this.showLoading=true;
        this.offset=0;
        let res=await showList(this.latitude,this.longitude,this.offset,"",this.restaurantCategoryId);
        this.hideLoading();
        this.shopListArr=[...res];
      },
      hideLoading(){
        this.showLoading=false;
      },
      zhunshi(supports){

        let zhunStatus;
        if((supports instanceof Array)&&supports.length){
          supports.forEach(item=>{

            if(item.icon_name==="准"){
              zhunStatus = true;
            }
          })
        }else{
          zhunStatus=false;
        }
        return zhunStatus;
      },

    },
    watch:{
      restaurantCategoryIds:function (value) {
        this.listenPropChange();
      },
      sortByType:function(value){
        this.listenPropChange();
      },
      confirmSelect:function (value) {
        this.listenPropChange();

      },
      confirmSelect:function (value) {
        this.listenPropChange();
        this.$emit("DidConfrim");
      }
    }

  }

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .shoplist_container{
    background-color: #fff;
    margin-bottom: 2rem;

  }
  .shop_li{
    display: flex;
    border-bottom:0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;

  }
  .shop_img{
    @include wh(2.7rem,2.7rem);
    display: block;
    margin-right: 0.4rem;
  }
  .list_back_li{
    height: 4.85rem;
    .list_back_svg{
      @include wh(100%,100%);
    }
  }
  .shop_right{
    flex:auto;
    .shop_detail_header{
      @include fj;
      align-items: center;
      .shop_title{
        width: 8.5rem;
        color: #333;
        padding-top: 0.01rem;
        @include  font(0.65rem,0.65rem,"PingFangSC-Regular");
        font-weight: 700;

      }
      .premium::before{
        content:"品牌";
        display:inline-block;;
        font-size:0.5rem;
        line-height: 0.6rem;
        color:#333;
        background-color: #ffd930;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
      }
      .shop_detail_ul{
        display: flex;
        transform: scale(0.8);
        margin-right: -0.3rem;
        .supports{
          @include sc(0.5rem,#999);
          border:0.025rem solid #f1f1f1;
          padding: 0 0.04rem;
          border-radius: 0.08rem;
          margin-left:0.05rem;
        }
      }
    }
    .rating_order_num{
      @include fj(space-between);
      height: 0.6rem;
      margin-top:0.52rem;
      .rating_order_num_left{
        @include  fj(flex-start);
        .rating_section{
          display: flex;
          .rating_num{
            @include  sc(0.4rem ,#ff6000);
            margin:0 0.2rem;
          }
        }
        .order_section{
          transform: scale(0.8);
        }
      }
    }
  }
</style>
