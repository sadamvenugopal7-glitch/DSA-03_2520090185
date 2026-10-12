package com.recommendationengine.algorithms;

import java.util.ArrayList;

/**
 * ============================================================================
 * DSA COMPONENT: MAX-HEAP PRIORITY QUEUE
 * Course: Data Structures and Algorithms - 3 (25CS2103E)
 * ============================================================================
 * 
 * Concept:
 * A binary heap represented as a complete binary tree using a 0-indexed ArrayList.
 * 
 * Heap Property:
 * For every node i other than the root, priority(parent(i)) >= priority(i).
 * The root node always holds the maximum priority element.
 * 
 * Array Index Calculations:
 * - Parent index: (i - 1) / 2
 * - Left child index: 2 * i + 1
 * - Right child index: 2 * i + 2
 * 
 * Time Complexities for Viva:
 * - insert(): O(log N) due to heapifyUp bubbling
 * - extractMax(): O(log N) due to heapifyDown sinking
 * - peek(): O(1) direct root inspection
 * - size() / isEmpty(): O(1)
 * 
 * Why used in Recommendation Engine:
 * Instead of sorting all N movies with O(N log N) sorting, we push candidates into
 * this MaxHeap and extract only the Top-K recommendations in O(K log N) time!
 * ============================================================================
 */
public class MaxHeap<T> {

    /**
     * Inner class representing a node in the Priority Queue.
     */
    public static class HeapNode<T> {
        private final T data;
        private final double priority; // Recommendation Score (higher = top priority)

        public HeapNode(T data, double priority) {
            this.data = data;
            this.priority = priority;
        }

        public T getData() { return data; }
        public double getPriority() { return priority; }
    }

    // ArrayList concept for dynamic array-based complete binary tree storage
    private final ArrayList<HeapNode<T>> heap;

    public MaxHeap() {
        this.heap = new ArrayList<>();
    }

    // Helper index methods
    private int parentIndex(int i) { return (i - 1) / 2; }
    private int leftChildIndex(int i) { return 2 * i + 1; }
    private int rightChildIndex(int i) { return 2 * i + 2; }

    private boolean hasParent(int i) { return i > 0; }
    private boolean hasLeftChild(int i) { return leftChildIndex(i) < heap.size(); }
    private boolean hasRightChild(int i) { return rightChildIndex(i) < heap.size(); }

    private void swap(int i, int j) {
        HeapNode<T> temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    /**
     * Inserts an element with a given priority into the Max-Heap.
     * Time Complexity: O(log N)
     */
    public void insert(T element, double priority) {
        HeapNode<T> node = new HeapNode<>(element, priority);
        heap.add(node); // Append to bottom leaf
        heapifyUp(heap.size() - 1); // Restore heap property upwards
    }

    /**
     * Bubbles up the node at index until the heap property is restored.
     * Time Complexity: O(log N)
     */
    private void heapifyUp(int index) {
        int current = index;
        while (hasParent(current) && heap.get(parentIndex(current)).getPriority() < heap.get(current).getPriority()) {
            int parent = parentIndex(current);
            swap(current, parent);
            current = parent;
        }
    }

    /**
     * Extracts and returns the maximum priority node from the heap root.
     * Time Complexity: O(log N)
     */
    public HeapNode<T> extractMax() {
        if (isEmpty()) {
            return null;
        }

        if (heap.size() == 1) {
            return heap.remove(0);
        }

        HeapNode<T> maxNode = heap.get(0);
        // Move the last leaf to root and sink down
        HeapNode<T> lastElement = heap.remove(heap.size() - 1);
        heap.set(0, lastElement);
        heapifyDown(0);

        return maxNode;
    }

    /**
     * Sinks down the node at index until the heap property is restored.
     * Time Complexity: O(log N)
     */
    private void heapifyDown(int index) {
        int current = index;
        while (hasLeftChild(current)) {
            int largerChildIndex = leftChildIndex(current);

            if (hasRightChild(current) && heap.get(rightChildIndex(current)).getPriority() > heap.get(largerChildIndex).getPriority()) {
                largerChildIndex = rightChildIndex(current);
            }

            if (heap.get(current).getPriority() >= heap.get(largerChildIndex).getPriority()) {
                break; // Heap property satisfied
            }

            swap(current, largerChildIndex);
            current = largerChildIndex;
        }
    }

    /**
     * Peeks at the maximum priority node without removing it.
     * Time Complexity: O(1)
     */
    public HeapNode<T> peek() {
        if (isEmpty()) return null;
        return heap.get(0);
    }

    public int size() {
        return heap.size();
    }

    public boolean isEmpty() {
        return heap.isEmpty();
    }
}
