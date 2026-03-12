export class Boundary {
  private start: Comment;
  private end: Comment;

  constructor(parent: Node, label: string = "boundary") {
    this.start = document.createComment(`${label}-start`);
    this.end = document.createComment(`${label}-end`);
    parent.appendChild(this.start);
    parent.appendChild(this.end);
  }

  public clear(): void {
    let current = this.start.nextSibling;
    while (current && current !== this.end) {
      const toRemove = current;
      current = current.nextSibling;
      toRemove.parentNode?.removeChild(toRemove);
    }
  }

  public insert(node: Node): void {
    this.end.parentNode?.insertBefore(node, this.end);
  }

  public get parent(): Node | null {
    return this.start.parentNode;
  }
}
