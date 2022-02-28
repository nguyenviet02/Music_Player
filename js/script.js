const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cd = $(".cd");
const player = $(".player");
const header = $('header h2');
const cd_thumb = $('.cd-thumb');
const audio = $('#audio');
const btn_play = $(".btn-toggle-play");
const btn_prev = $(".btn-prev");
const btn_next = $(".btn-next");
const btn_repeat = $(".btn-repeat");
const btn_random = $(".btn-random");
const progress = $(".progress");
const duration_minutes = $(".duration-minutes");
const duration_seconds = $(".duration-seconds");
const current_time_minute = $(".current_time-minutes");
const current_time_second = $(".current_time-seconds");


let cdWidth = cd.offsetWidth;


const app = {
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  songDuration: 0,
  //* List songs
  songs: [
    {
      name: "Chạy Về Khóc Với Anh",
      singer: "ERIK",
      path: "./media/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3",
      image: "./media/music_images/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.webp"
    },
    {
      name: "Ta Là Của Nhau",
      singer: "Đông Nhi - Ông Cao Thắng",
      path: "./media/music/TaLaCuaNhau-DongNhiOngCaoThang-4113753.mp3",
      image:
        "./media/music_images/TaLaCuaNhau-DongNhiOngCaoThang-4113753.jpg"
    },
    {
      name: "Mượn Rượu Tỏ Tình",
      singer: "Emily-BigDaddy",
      path:
        "./media/music/MuonRuouToTinh-EmilyBigDaddy-5871420.mp3",
      image: "./media/music_images/MuonRuouToTinh-EmilyBigDaddy-5871420.jpg"
    },
    {
      name: "Một Cú Lừa",
      singer: "Bích Phương",
      path: "./media/music/MotCuLua-BichPhuong-6288019.mp3",
      image:
        "./media/music_images/MotCuLua-BichPhuong-6288019.png"
    },
    {
      name: "Hãy Trao Cho Anh",
      singer: "Sơn Tùng MTP",
      path: "./media/music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      image:
        "./media/music_images/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.jpg"
    },
    {
      name: "Chạy Ngay Đi",
      singer: "Sơn Tùng MTP",
      path:
        "./media/music/Chạy Ngay Đi - Sơn Tùng M-TP.mp3",
      image:
        "./media/music_images/ChayNgayDi.jpg"
    },
    {
      name: "Bùa Yêu",
      singer: "Bích Phương",
      path: "./media/music/BuaYeu-BichPhuong-5472208.mp3",
      image:
        "./media/music_images/BuaYeu-BichPhuong-5472208.png"
    }
  ],

  //* Định nghĩa properties cho app
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },

  //* Load dữ liệu bài hát hiện tại
  loadCurrentSong: function () {
    _this = this;
    function pad(d) {
      return (d < 10) ? '0' + d.toString() : d.toString();
    }
    let songActive = $(`div[song_index='${this.currentIndex}']`);
    let listSongs = document.querySelectorAll(".song");
    listSongs.forEach(song => song.classList.remove("active"));
    songActive.classList.add("active");
    let timeDuration = 0;
    let currentTime = 0;
    header.innerText = this.currentSong.name;
    cd_thumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;

    //* Lấy thời gian bài hát
    audio.onloadedmetadata = function () {
      _this.songDuration = audio.duration;
      audio.ontimeupdate = function () {
        currentTime = audio.currentTime;
        progress.value = `${Math.floor((currentTime / _this.songDuration) * 100)}`;
        current_time_minute.innerText = pad(Math.floor(currentTime / 60));
        current_time_second.innerText = pad(Math.floor(currentTime % 60));
      }
      // From timeDuration to minute:second
      let duration_minute = Math.floor(_this.songDuration / 60);
      let duration_second = Math.floor(_this.songDuration % 60);
      duration_minutes.innerText = pad(duration_minute);
      duration_seconds.innerText = pad(duration_second);
    };
  },

  //* Hàm render playlist
  render: function () {
    var htmls = this.songs.map((song, index) => {
      return `
      <div class="song"  song_index ="${index}" >
        <div class="thumb"
          style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `
    })
    playlist.innerHTML = htmls.join("");
  },

  //* Hàm xử lí sự kiện
  handleEvent: function () {
    _this = this;

    //<> Xử lí sự kiện scroll
    document.onscroll = function () {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      let cdNewWidth = cdWidth - scrollTop;
      if (cdNewWidth < 0) {
        cdNewWidth = 0;
      }
      cd.style.width = cdNewWidth + "px";
    }

    //<> Xử lí sự kiện click vào nút play
    btn_play.onclick = function () {
      if (audio.paused) {
        audio.play();
        player.classList.add("playing");
        _this.isPlaying = true;
        cd.classList.add("active");
      } else {
        audio.pause();
        player.classList.remove("playing");
        _this.isPlaying = false;
        cd.classList.remove("active");
      }
    }

    //<> Xử lí sự kiện click vào nút prev
    btn_prev.onclick = function () {
      if (_this.isShuffle) {
        _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
      }
      else {
        _this.currentIndex -= 1;
        if (_this.currentIndex < 0) {
          _this.currentIndex = _this.songs.length - 1;
        }
      }
      _this.loadCurrentSong();
      if (_this.isPlaying) {
        audio.play();
      }
    }

    //<> Xử lí sự kiện click vào nút next
    btn_next.onclick = function () {
      if (_this.isShuffle) {
        _this.currentIndex = Math.floor(Math.random() * _this.songs.length);
      }
      else {
        _this.currentIndex += 1;
        if (_this.currentIndex > _this.songs.length - 1) {
          _this.currentIndex = 0;
        }
      }
      console.log(_this.currentIndex);
      _this.loadCurrentSong();
      if (_this.isPlaying) {
        audio.play();
      }
    }

    //<> Xử lí sự kiện click vào nút repeat
    btn_repeat.onclick = function () {
      audio.loop = !audio.loop;
      btn_repeat.classList.toggle("active");
    }

    //<> Xử lí sự kiện click vào nút shuffle{
    btn_random.onclick = function () {
      _this.isShuffle = !_this.isShuffle;
      btn_random.classList.toggle("active");
    }

    //<> Xử lí sự kiện khi end
    audio.onended = function () {
      if (_this.isShuffle) {
        _this.currentIndex = parseInt(Math.floor(Math.random() * _this.songs.length));
      }
      else {
        _this.currentIndex = parseInt(_this.currentIndex) + 1;
        if (_this.currentIndex > _this.songs.length - 1) {
          _this.currentIndex = 0;
        }
      }
      _this.loadCurrentSong();
      if (_this.isPlaying) {
        audio.play();
      }
    }

    //<> Xử lí sự kiện tua bài hát
    progress.onchange = function (e) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }

    //<> Xử lí sự kiện khi ấn vào 1 bài hát trong playlist
    let listSongs = document.querySelectorAll(".song");
    listSongs.forEach(song => {
      song.onclick = function () {
        listSongs.forEach(song => song.classList.remove("active"));
        this.classList.add("active");
        _this.currentIndex = parseInt(song.getAttribute("song_index"));
        console.log(_this.currentIndex);
        _this.loadCurrentSong();
        if (_this.isPlaying) {
          audio.play();
        }
      }
    })


  },

  start: function () {
    this.defineProperties();
    this.render();
    this.handleEvent();
    this.loadCurrentSong();
  }

}

app.start();