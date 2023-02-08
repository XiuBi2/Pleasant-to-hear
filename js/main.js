/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
var app = new Vue({
  el: '#player',
  data: {
    // 搜索关键字
    query: '',
    // 歌曲列表
    musicList: [],
    // 歌曲url
    musicUrl: '',
    // 是否正在播放
    isPlay: false,
    // 歌曲热门评论
    hotComments: [],
    // 歌曲封面地址
    coverUrl: '',
    // 显示视频播放
    showVideo: false,
    // mv地址
    mvUrl: ''
  },
  methods: {
    // 搜索歌曲
    searchMusic() {
      const that = this
      axios.get('https://autumnfish.cn/cloudsearch?keywords=' + this.query)
        .then(function (response) {
          // console.log(response);
          that.musicList = response.data.result.songs
          console.log(that.musicList);
        }), function (err) {
          console.log(err);
        }
        this.query = ''
    },
    // 歌曲控制
    playMusic(musicId) {
      const that = this
      // 播放歌曲
      axios.get('https://autumnfish.cn/song/url?id=' + musicId)
      .then(function(response){
        // console.log(response);
        that.musicUrl = response.data.data[0].url
      }), function(err){
        console.log(err);
      }
      // 获取歌曲封面
      axios.get('https://autumnfish.cn/song/detail?ids=' + musicId)
      .then(function(response){
        that.coverUrl = response.data.songs[0].al.picUrl
        // console.log(that.coverUrl);
      }), function(err){
        console.log(err);
      }
      // 获取评论
      axios.get('https://autumnfish.cn/comment/hot?type=0&id=' + musicId)
      .then(function(response){
        that.hotComments = response.data.hotComments
        // console.log(that.hotComments);
      }), function(err){
        console.log(err);
      }
    },
    // audio 的play事件
    play() {
      // console.log('play');
      this.isPlay = true
      this.mvUrl = ''
    },
    // audio 的pause事件
    pause() {
      // console.log('pause');
      this.isPlay = false
    },
    // 播放MV
    playMv(vid){
      if(vid){
        this.showVideo = true
        const that = this
        axios.get('https://autumnfish.cn/mv/url?id=' + vid)
        .then(function(response){
          that.mvUrl = response.data.data.url  
          that.$refs.audio.pause()
          // console.log(that.mvUrl);
        }), function(err){
          console.log(err);
        }
      }
    },
    // 关闭mv界面
    closeMv() {
      this.showVideo = false
      this.$refs.video.pause()
    },
  },
})