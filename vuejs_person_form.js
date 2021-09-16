new Vue({
  el: "#person",

  data:
  {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: ''
  },

  methods:
  {
    logData: function()
    {
      console.log(this.id + " " + this.email + " " + this.firstName + " " + this.lastName + " " + this.avatar);
    }

  },

  computed:
  {

  }
});
