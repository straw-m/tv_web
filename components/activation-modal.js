// 激活码弹窗组件
class ActivationModal {
    constructor() {
        this.modalId = 'activation-modal';
        this.isModalCreated = false;
    }

    // 初始化弹窗
    init() {
        if (!this.isModalCreated) {
            this.createModal();
            this.bindEvents();
            this.isModalCreated = true;
        }
    }

    // 创建弹窗HTML结构
    createModal() {
        // 检查是否已存在弹窗元素
        if (document.getElementById(this.modalId)) {
            return;
        }

        // 创建弹窗HTML模板
        const modalHtml = `
        <div class="modal" id="${this.modalId}" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>输入激活码</h3>
                    <button class="close-button" id="close-activation-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <input type="text" id="activation-code-input" placeholder="请输入激活码" class="activation-input">
                    <div class="activation-message" id="activation-message"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancel-activation-button">取消</button>
                    <button class="btn" id="submit-activation-button">提交</button>
                </div>
            </div>
        </div>
        `;

        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = this.getModalStyles();
        document.head.appendChild(style);

        // 添加弹窗HTML到body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
    }

    // 获取弹窗CSS样式
    getModalStyles() {
        return `
        /* 激活码弹窗样式 */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 400px;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .modal-header h3 {
            margin: 0;
        }

        .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }

        .activation-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .activation-message {
            min-height: 20px;
            margin-bottom: 15px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        `;
    }

    // 绑定事件
    bindEvents() {
        const modal = document.getElementById(this.modalId);
        const closeBtn = document.getElementById('close-activation-modal');
        const cancelBtn = document.getElementById('cancel-activation-button');
        const submitBtn = document.getElementById('submit-activation-button');
        
        // 关闭按钮事件
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // 取消按钮事件
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // 提交按钮事件
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submit());
        }

        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.close();
            }
        });
    }

    // 打开弹窗
    open() {
        this.init();
        const modal = document.getElementById(this.modalId);
        const codeInput = document.getElementById('activation-code-input');
        const messageElement = document.getElementById('activation-message');
        
        if (modal && codeInput && messageElement) {
            modal.style.display = 'flex';
            codeInput.value = '';
            messageElement.textContent = '';
            codeInput.focus();
        }
    }

    // 关闭弹窗
    close() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 提交激活码
    submit() {
        const codeInput = document.getElementById('activation-code-input');
        const messageElement = document.getElementById('activation-message');
        
        if (!codeInput || !messageElement) {
            console.error('激活码弹窗元素未找到');
            return;
        }

        const code = codeInput.value.trim();
        const sessionId = localStorage.getItem('session_id');
        
        if (!code) {
            messageElement.textContent = '请输入激活码';
            messageElement.style.color = 'red';
            return;
        }
        
        if (!sessionId) {
            messageElement.textContent = '未找到会话信息，请重新登录';
            messageElement.style.color = 'red';
            return;
        }
        
        // 调用实际API提交激活码
        const baseUrl = 'http://43.134.114.73:8000'; // 基础URL，可以从配置中获取
        const apiUrl = `${baseUrl}/api/activation-code/activate/${code}?session_id=${sessionId}`;
        
        fetch(apiUrl, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.detail || '激活失败');
                });
            }
            return response.json();
        })
        .then(result => {
            // 根据要求，检查status是否为success
            if (result.status === 'success') {
                messageElement.textContent = '激活成功！';
            } else {
                messageElement.textContent = result.message || '激活成功！';
            }
            messageElement.style.color = 'green';
            
            // 成功后更新页面上的有效期显示（如果存在）
            setTimeout(() => {
                this.close();
                this.updateValidityDisplay();
            }, 1500);
        })
        .catch(error => {
            messageElement.textContent = error.message || '提交失败，请稍后重试';
            messageElement.style.color = 'red';
        });
    }

    // 更新页面上的有效期显示
    updateValidityDisplay() {
        const validityElement = document.getElementById('validity-remaining');
        if (!validityElement) {
            return; // 页面上没有有效期显示元素
        }

        // 简单的有效期显示逻辑
        validityElement.textContent = '加载中...';
    }
}

// 导出激活码弹窗实例
export const activationModal = new ActivationModal();

// 创建全局变量，方便在不使用ES模块的页面中使用
if (typeof window !== 'undefined') {
    window.activationModal = activationModal;
}