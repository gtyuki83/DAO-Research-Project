// This class is used to update listeners
// in the AuthHolder class

export default interface AuthListener {
  onAuthChanged(): void;
}
