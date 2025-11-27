// 初始化APlayer播放器
const aplayer = new APlayer({
  container: document.getElementById('aplayer-fixed'),
  fixed: true,                    // 吸底模式，页面切换时不消失
  autoplay: false,                 // 避免浏览器自动播放拦截
  theme: '#ad7a86',               // 自定义主题色
  preload: 'auto',                // 预加载策略
  mutex: true,                    // 阻止多个播放器同时播放
  lrcType: 3,                     // 歌词加载方式（0:关闭, 1:JS字符串, 3:外部LRC文件）
  // 若使用MetingJS则无需audio数组，否则手动配置音乐列表
  // audio: [{ name: '歌曲名', artist: '艺术家', url: 'music.mp3', cover: 'cover.jpg' }]
});

// 保存播放状态到 sessionStorage
aplayer.on('timeupdate', () => {
  sessionStorage.setItem('audioTime', aplayer.audio.currentTime);
  sessionStorage.setItem('audioPlaying', !aplayer.audio.paused);
});

// 页面加载时恢复播放状态
document.addEventListener('DOMContentLoaded', () => {
  const savedTime = sessionStorage.getItem('audioTime');
  const wasPlaying = sessionStorage.getItem('audioPlaying') === 'true';
  
  if (savedTime) {
    aplayer.seek(parseFloat(savedTime));
    if (wasPlaying) {
      // 处理自动播放策略：需要用户交互
      const playButton = document.getElementById('music-start');
      if (playButton) {
        playButton.addEventListener('click', () => {
          aplayer.play();
          playButton.style.display = 'none';
        });
      } else {
        aplayer.play().catch(e => {
          console.log('自动播放被阻止，需用户交互');
        });
      }
    }
  }
});

// 页面可见性优化（移动端后台自动暂停）
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    aplayer.pause(); // 切到后台暂停
  } else if (sessionStorage.getItem('audioPlaying') === 'true') {
    aplayer.play(); // 切回前台恢复
  }
});