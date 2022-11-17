import create from "zustand";


/**
 * As we see create takes a callback function as an input. Also, this callback function takes another function (set) as a parameter
 * to update the states of the objects/variables we define inside the first callback function. 
 */

const useStore = create((set, get) => ({
  userLoginStatus: false,
  user: null,
  setUserLoginStatus: () => set((state) => ({userLoginStatus: true})),
  resetUserLoginStatus: () => {
    set((state) => ({userLoginStatus: false}))
    console.log(get().userLoginStatus)
  },
  setUser: (user) => {
    
    set((state) => (
      {user: {name: user.name, profileImageUrl: user.profileImageUrl}}
      ))
    console.log(user);
    },
  resetUser: () => {
    set((state) => ({user: null}))
    // console.log(user);
  }
  

}))


/**
 * Keep this code as a template to refer how to use Zustand. 
 */
// const useStore = create((set) => ({
//     bears: 2,
//     increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//     removeAllBears: () => set({ bears: 0 }),
//   }))

export default useStore;