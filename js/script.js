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


let cdWidth = cd.offsetWidth;


const app = {
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  //* List songs
  songs: [
    {
      name: "Chạy Về Khóc Với Anh",
      singer: "ERIK",
      path: "./media/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3",
      image: "https://photo-resize-zmp3.zadn.vn/w320_r1x1_webp/cover/c/6/d/e/c6def069a1a885c41fe479358fa7c506.jpg"
    },
    {
      name: "Ta Là Của Nhau",
      singer: "Đông Nhi - Ông Cao Thắng",
      path: "./media/music/TaLaCuaNhau-DongNhiOngCaoThang-4113753.mp3",
      image:
        "https://media.doisongvietnam.vn/u/rootimage/editor/2020/05/26/21/21/max1590481274_0853.jpg"
    },
    {
      name: "Mượn Rượu Tỏ Tình",
      singer: "Emily-BigDaddy",
      path:
        "./media/music/MuonRuouToTinh-EmilyBigDaddy-5871420.mp3",
      image: "https://avatar-nct.nixcdn.com//blog/2019/03/09/0/c/e/9/1552122986482.jpg"
    },
    {
      name: "Một Cú Lừa",
      singer: "Bích Phương",
      path: "./media/music/MotCuLua-BichPhuong-6288019.mp3",
      image:
        "https://media.vov.vn/uploaded/9eqrbt2uv7o/2020_06_01/Picture2_YEXD.png"
    },
    {
      name: "Hãy Trao Cho Anh",
      singer: "Sơn Tùng MTP",
      path: "./media/music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
      image:
        "https://nld.mediacdn.vn/2019/7/2/635k-view-premiere-15620590708781264015848.jpg"
    },
    {
      name: "Chạy Ngay Đi",
      singer: "Sơn Tùng MTP",
      path:
        "./media/music/Chạy Ngay Đi - Sơn Tùng M-TP.mp3",
      image:
        "https://i1.sndcdn.com/artworks-000347253627-q007hh-t500x500.jpg"
    },
    {
      name: "Bùa Yêu",
      singer: "Bích Phương",
      path: "./media/music/BuaYeu-BichPhuong-5472208.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/vi/4/42/B%C3%ACa_%C4%91%C4%A9a_B%C3%B9a_y%C3%AAu_-_B%C3%ADch_Ph%C6%B0%C6%A1ng.png"
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
    let songActive = $(`div[song_index='${this.currentIndex}']`);
    let listSongs = document.querySelectorAll(".song");
    listSongs.forEach(song => song.classList.remove("active"));
    songActive.classList.add("active");
    let timeDuration = 0;
    let currentTime = 0;
    header.innerText = this.currentSong.name;
    cd_thumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    audio.onloadedmetadata = function () {
      timeDuration = audio.duration;
      audio.ontimeupdate = function () {
        currentTime = audio.currentTime;
        progress.value = `${Math.floor((currentTime / timeDuration) * 100)}`;
      }
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
        _this.currentIndex = song.getAttribute("song_index");
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