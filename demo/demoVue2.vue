<template>
  <div class="show">
    <div id="btn-error" class="btn" @click="makeError">制造错误</div>
    <div id="btn-request" class="btn" @click="sendRequest">发送请求</div>
    <div v-for="item in JSON.parse(list)">{{item}}</div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      list: null// '[1,2,3]'
    }
  },
  mounted () {
    throw new Error('我是错误')
  },
  methods: {
    makeError() {
      test()
    },
    sendRequest() {
      (new Promise((resolve, reject) => {
        axios.get('https://s1.loooooooooong.com/public/js/axios.min.js').then(res => {
          resolve(res);
        });
      })).then(res => {test(123)})
      new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: 'https://m7-hlgw-c1-openapi.loooooooong.com/julianos-prod/api/admin/snapshot/make/url',
          headers: {'X-Gaia-Api-Key': 'a2e33eb4-6516-43f9-bcc0-9c47b0f123b3'},
          withCredentials: true,
          data: {
            guid: '1C256D51-8B5C-4339-A1A0-0B5B2B40B9DA'
          }
        }).then(res => {
          console.log(res);
        }).catch(err => {
          reject('出错了')
        })
      })
      
      axios.get('https://api-uat.loooooooong.com/julianos-uat/', {
        headers: {'X-Gaia-Api-Key': '791f6690-0714-445f-9273-78a3199622d2'},
      }).then(res => {
        err()
      })
    }
  },
}
</script>